import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Upload, X, ImageIcon } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
}

interface Props {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const EditCourseDialog = ({ course, open, onOpenChange, onSaved }: Props) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const isNew = !course;

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description || '');
      setThumbnailUrl(course.thumbnail_url || '');
      setThumbnailPreview(course.thumbnail_url || null);
      setIsPublished(course.is_published);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setThumbnailUrl('');
      setThumbnailPreview(null);
      setIsPublished(false);
    }
    setThumbnailFile(null);
  }, [course, open]);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)/g, '');

  const handleFileSelect = (file: File | null) => {
    setThumbnailFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview(thumbnailUrl || null);
    }
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return thumbnailUrl.trim() || null;
    const fileExt = thumbnailFile.name.split('.').pop();
    const fileName = `courses/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage.from('thumbnails').upload(fileName, thumbnailFile);
    if (error) {
      toast({ title: 'থাম্বনেইল আপলোড ব্যর্থ', description: error.message, variant: 'destructive' });
      return null;
    }
    const { data: urlData } = supabase.storage.from('thumbnails').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: 'শিরোনাম ও স্লাগ আবশ্যক', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const uploadedUrl = await uploadThumbnail();
    if (thumbnailFile && !uploadedUrl) {
      setSaving(false);
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      thumbnail_url: uploadedUrl,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('courses').insert(payload));
    } else {
      ({ error } = await supabase.from('courses').update(payload).eq('id', course.id));
    }

    setSaving(false);
    if (error) {
      toast({ title: 'সংরক্ষণ ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isNew ? 'কোর্স তৈরি হয়েছে' : 'কোর্স আপডেট হয়েছে' });
      onOpenChange(false);
      onSaved();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? 'নতুন কোর্স তৈরি' : 'কোর্স সম্পাদনা'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>শিরোনাম</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (isNew) setSlug(generateSlug(e.target.value));
              }}
              placeholder="কোর্সের শিরোনাম"
            />
          </div>
          <div>
            <Label>স্লাগ (URL)</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="course-slug" />
          </div>
          <div>
            <Label>বিবরণ</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="কোর্সের বিবরণ" />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <Label className="mb-2 block">থাম্বনেইল</Label>
            {thumbnailPreview ? (
              <div className="relative rounded-lg border border-border overflow-hidden">
                <img src={thumbnailPreview} alt="Preview" className="h-40 w-full object-cover" />
                <button
                  onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); setThumbnailUrl(''); }}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ছবি নির্বাচন করুন</span>
                <span className="text-xs text-muted-foreground">JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>প্রকাশিত</Label>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseDialog;
