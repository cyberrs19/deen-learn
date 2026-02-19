import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Upload, Link, X } from 'lucide-react';

interface Lecture {
  id: string;
  course_id: string;
  title: string;
  youtube_url: string | null;
  pdf_url: string | null;
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
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isNew = !lecture;

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.title);
      setCourseId(lecture.course_id);
      setYoutubeUrl(lecture.youtube_url || '');
      setPdfUrl(lecture.pdf_url || '');
      setSortOrder(lecture.sort_order);
      setIsPublic(lecture.is_public);
      setPdfMode('link');
      setPdfFile(null);
    } else {
      setTitle('');
      setCourseId(courses[0]?.id || '');
      setYoutubeUrl('');
      setPdfUrl('');
      setSortOrder(0);
      setIsPublic(false);
      setPdfMode('link');
      setPdfFile(null);
    }
  }, [lecture, open, courses]);

  const uploadPdf = async (): Promise<string | null> => {
    if (!pdfFile) return null;
    setUploading(true);
    const fileExt = pdfFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${courseId}/${fileName}`;

    const { error } = await supabase.storage.from('lecture-pdfs').upload(filePath, pdfFile);
    setUploading(false);

    if (error) {
      toast({ title: 'PDF আপলোড ব্যর্থ', description: error.message, variant: 'destructive' });
      return null;
    }

    const { data: urlData } = supabase.storage.from('lecture-pdfs').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!title.trim() || !courseId) {
      toast({ title: 'শিরোনাম ও কোর্স আবশ্যক', variant: 'destructive' });
      return;
    }

    setSaving(true);

    let finalPdfUrl = pdfUrl.trim() || null;
    if (pdfMode === 'upload' && pdfFile) {
      const uploadedUrl = await uploadPdf();
      if (!uploadedUrl) {
        setSaving(false);
        return;
      }
      finalPdfUrl = uploadedUrl;
    }

    const payload = {
      course_id: courseId,
      title: title.trim(),
      youtube_url: toEmbedUrl(youtubeUrl.trim()) || null,
      pdf_url: finalPdfUrl,
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
      <DialogContent className="sm:max-w-lg">
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
          <div>
            <Label>YouTube URL</Label>
            <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            <p className="mt-1 text-xs text-muted-foreground">স্বয়ংক্রিয়ভাবে embed URL এ রূপান্তর হবে</p>
          </div>

          {/* PDF Section */}
          <div>
            <Label className="mb-2 block">PDF নোটস</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                size="sm"
                variant={pdfMode === 'link' ? 'default' : 'outline'}
                onClick={() => setPdfMode('link')}
                className="gap-1.5"
              >
                <Link className="h-3.5 w-3.5" />
                লিংক দিন
              </Button>
              <Button
                type="button"
                size="sm"
                variant={pdfMode === 'upload' ? 'default' : 'outline'}
                onClick={() => setPdfMode('upload')}
                className="gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                আপলোড করুন
              </Button>
            </div>

            {pdfMode === 'link' ? (
              <Input
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                placeholder="https://example.com/notes.pdf"
              />
            ) : (
              <div>
                {pdfFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                    <span className="flex-1 truncate text-foreground">{pdfFile.name}</span>
                    <button onClick={() => setPdfFile(null)} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/50">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">PDF ফাইল নির্বাচন করুন</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
                {pdfUrl && !pdfFile && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    বর্তমান: <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">দেখুন</a>
                  </p>
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
          <Button onClick={handleSave} disabled={saving || uploading} className="w-full">
            {uploading ? 'আপলোড হচ্ছে...' : saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLectureDialog;
