import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const isNew = !course;

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setSlug(course.slug);
      setDescription(course.description || '');
      setThumbnailUrl(course.thumbnail_url || '');
      setIsPublished(course.is_published);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setThumbnailUrl('');
      setIsPublished(false);
    }
  }, [course, open]);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      toast({ title: 'শিরোনাম ও স্লাগ আবশ্যক', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
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
          <div>
            <Label>থাম্বনেইল URL</Label>
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
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
