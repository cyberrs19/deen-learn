import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Upload, Link, X, ImageIcon } from 'lucide-react';

interface Lecture {
  id: string;
  course_id: string;
  title: string;
  youtube_url: string | null;
  pdf_url: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_public: boolean;
}

interface Course {
  id: string;
  title: string;
}

interface Props {
  lecture: Lecture | null;
  courses: Course[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const toEmbedUrl = (url: string): string => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const EditLectureDialog = ({ lecture, courses, open, onOpenChange, onSaved }: Props) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfMode, setPdfMode] = useState<'link' | 'upload'>('link');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  const isNew = !lecture;

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title);
      setCourseId(lecture.course_id);
      setYoutubeUrl(lecture.youtube_url || '');
      setPdfUrl(lecture.pdf_url || '');
      setThumbnailUrl(lecture.thumbnail_url || '');
      setThumbnailPreview(lecture.thumbnail_url || null);
      setSortOrder(lecture.sort_order);
      setIsPublic(lecture.is_public);
    } else {
      setTitle('');
      setCourseId(courses[0]?.id || '');
      setYoutubeUrl('');
      setPdfUrl('');
      setThumbnailUrl('');
      setThumbnailPreview(null);
      setSortOrder(0);
      setIsPublic(false);
    }
    setPdfMode('link');
    setPdfFile(null);
    setThumbnailFile(null);
  }, [lecture, open, courses]);

  const handleThumbnailSelect = (file: File | null) => {
    setThumbnailFile(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(thumbnailUrl || null);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) {
      toast({ title: 'আপলোড ব্যর্থ', description: error.message, variant: 'destructive' });
      return null;
    }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!title.trim() || !courseId) {
      toast({ title: 'শিরোনাম ও কোর্স আবশ্যক', variant: 'destructive' });
      return;
    }

    setSaving(true);

    // Upload PDF if needed
    let finalPdfUrl = pdfUrl.trim() || null;
    if (pdfMode === 'upload' && pdfFile) {
      const url = await uploadFile(pdfFile, 'lecture-pdfs', courseId);
      if (!url) { setSaving(false); return; }
      finalPdfUrl = url;
    }

    // Upload thumbnail if needed
    let finalThumbnailUrl = thumbnailUrl.trim() || null;
    if (thumbnailFile) {
      const url = await uploadFile(thumbnailFile, 'thumbnails', `lectures`);
      if (!url) { setSaving(false); return; }
      finalThumbnailUrl = url;
    }

    const payload = {
      course_id: courseId,
      title: title.trim(),
      youtube_url: toEmbedUrl(youtubeUrl.trim()) || null,
      pdf_url: finalPdfUrl,
      thumbnail_url: finalThumbnailUrl,
      sort_order: sortOrder,
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from('lectures').insert(payload));
    } else {
      ({ error } = await supabase.from('lectures').update(payload).eq('id', lecture.id));
    }

    setSaving(false);
    if (error) {
      toast({ title: 'সংরক্ষণ ব্যর্থ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: isNew ? 'লেকচার তৈরি হয়েছে' : 'লেকচার আপডেট হয়েছে' });
      onOpenChange(false);
      onSaved();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'নতুন লেকচার তৈরি' : 'লেকচার সম্পাদনা'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>কোর্স নির্বাচন</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="কোর্স বাছুন" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>শিরোনাম</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="লেকচারের শিরোনাম" />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <Label className="mb-2 block">থাম্বনেইল</Label>
            {thumbnailPreview ? (
              <div className="relative rounded-lg border border-border overflow-hidden">
                <img src={thumbnailPreview} alt="Preview" className="h-32 w-full object-cover" />
                <button
                  onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); setThumbnailUrl(''); }}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ছবি নির্বাচন করুন</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleThumbnailSelect(e.target.files?.[0] || null)} />
              </label>
            )}
          </div>

          <div>
            <Label>YouTube URL</Label>
            <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            <p className="mt-1 text-xs text-muted-foreground">স্বয়ংক্রিয়ভাবে embed URL এ রূপান্তর হবে</p>
          </div>

          {/* PDF Section */}
          <div>
            <Label className="mb-2 block">PDF নোটস</Label>
            <div className="flex gap-2 mb-2">
              <Button type="button" size="sm" variant={pdfMode === 'link' ? 'default' : 'outline'} onClick={() => setPdfMode('link')} className="gap-1.5">
                <Link className="h-3.5 w-3.5" /> লিংক দিন
              </Button>
              <Button type="button" size="sm" variant={pdfMode === 'upload' ? 'default' : 'outline'} onClick={() => setPdfMode('upload')} className="gap-1.5">
                <Upload className="h-3.5 w-3.5" /> আপলোড করুন
              </Button>
            </div>
            {pdfMode === 'link' ? (
              <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://example.com/notes.pdf" />
            ) : (
              <div>
                {pdfFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                    <span className="flex-1 truncate text-foreground">{pdfFile.name}</span>
                    <button onClick={() => setPdfFile(null)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">PDF ফাইল নির্বাচন করুন</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>ক্রম (Sort Order)</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            <Label>পাবলিক</Label>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLectureDialog;
