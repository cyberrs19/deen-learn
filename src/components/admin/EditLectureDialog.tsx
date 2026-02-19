import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
      setSortOrder(lecture.sort_order);
      setIsPublic(lecture.is_public);
    } else {
      setTitle('');
      setCourseId(courses[0]?.id || '');
      setYoutubeUrl('');
      setPdfUrl('');
      setSortOrder(0);
      setIsPublic(false);
    }
  }, [lecture, open, courses]);

  const handleSave = async () => {
    if (!title.trim() || !courseId) {
      toast({ title: 'শিরোনাম ও কোর্স আবশ্যক', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const payload = {
      course_id: courseId,
      title: title.trim(),
      youtube_url: toEmbedUrl(youtubeUrl.trim()) || null,
      pdf_url: pdfUrl.trim() || null,
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
          <div>
            <Label>PDF URL (নোটস)</Label>
            <Input value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://example.com/notes.pdf" />
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
