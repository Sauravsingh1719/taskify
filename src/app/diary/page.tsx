'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DiaryEntry {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function DiaryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [editingDiary, setEditingDiary] = useState<DiaryEntry | null>(null);
  const [newDiary, setNewDiary] = useState<Omit<DiaryEntry, '_id' | 'createdAt'> | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/sign-in');
    } else {
      fetchDiaries();
    }
  }, [session, router]);

  const fetchDiaries = async () => {
    try {
      const result = await axios.get('/api/diaries');
      if(result.data.length === 0){
        toast({
            title: 'No diary entries',
            description: 'You have no diary entries yet.',
        })
      }
      setDiaries(result.data);
    } catch (error) {
      console.error('Error fetching diaries:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch diaries.',
        variant: 'destructive',
      });
    }
  };

  const handleAddDiary = async () => {
    if (!newDiary) return;
    try {
      const response = await axios.post('/api/diaries', newDiary);
      setDiaries([...diaries, response.data.diary]);
      setNewDiary(null);
      toast({
        title: 'Success',
        description: 'Diary entry added successfully!',
      });
    } catch (error) {
      console.error('Error adding diary:', error);
      toast({
        title: 'Error',
        description: 'Could not add diary entry.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDiary = async (updatedDiary: DiaryEntry) => {
    try {
      await axios.put(`/api/diaries/${updatedDiary._id}`, updatedDiary);
      setDiaries(diaries.map((diary) => (diary._id === updatedDiary._id ? updatedDiary : diary)));
      setEditingDiary(null);
      toast({
        title: 'Success',
        description: 'Diary entry updated successfully!',
      });
    } catch (error) {
      console.error('Error updating diary:', error);
      toast({
        title: 'Error',
        description: 'Could not update diary entry.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDiary = async (diaryId: string) => {
    try {
      await axios.delete(`/api/diaries/${diaryId}`);
      setDiaries(diaries.filter((diary) => diary._id !== diaryId));
      toast({
        title: 'Success',
        description: 'Diary entry deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting diary:', error);
      toast({
        title: 'Error',
        description: 'Could not delete diary entry.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 h-dvh">
      <h1 className="text-3xl font-bold mb-6">My Diary</h1>

      {/* Add New Diary Entry */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Diary Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Title"
            value={newDiary?.title || ''}
            onChange={(e) => setNewDiary({ ...newDiary || {}, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            className="mt-4"
            value={newDiary?.description || ''}
            onChange={(e) => setNewDiary({ ...newDiary || {}, description: e.target.value })}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddDiary}>Add Diary</Button>
        </CardFooter>
      </Card>

      {/* Display Diaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diaries.map((diary) => (
          <Card key={diary._id}>
            <CardHeader>
              <CardTitle>{editingDiary?._id === diary._id ? (
                <Input
                  value={editingDiary.title}
                  onChange={(e) => setEditingDiary({ ...editingDiary, title: e.target.value })}
                />
              ) : (
                diary.title
              )}</CardTitle>
            </CardHeader>
            <CardContent>
              {editingDiary?._id === diary._id ? (
                <Textarea
                  value={editingDiary.description}
                  onChange={(e) => setEditingDiary({ ...editingDiary, description: e.target.value })}
                />
              ) : (
                <CardDescription>{diary.description}</CardDescription>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {editingDiary?._id === diary._id ? (
                <>
                  <Button size="sm" onClick={() => handleUpdateDiary(editingDiary)}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingDiary(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => setEditingDiary(diary)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteDiary(diary._id)}>Delete</Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
