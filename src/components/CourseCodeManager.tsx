
import { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseCodeManagerProps {
  courseCodes: Tables<"course_codes">[];
  onCourseCodeAdded: (course: Tables<"course_codes">) => void;
}

const CourseCodeManager = ({ courseCodes, onCourseCodeAdded }: CourseCodeManagerProps) => {
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const { toast } = useToast();

  const handleAddCourseCode = async () => {
    if (!newCourseCode || !newCourseName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both course code and name",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('course_codes')
        .insert({ 
          code: newCourseCode, 
          name: newCourseName 
        })
        .select()
        .single();

      if (error) throw error;

      onCourseCodeAdded(data);
      setNewCourseCode('');
      setNewCourseName('');
      toast({
        title: "Course Code Added",
        description: `${data.code} - ${data.name} has been added successfully`,
      });
    } catch (error) {
      console.error('Error adding course code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add course code. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <Input 
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            placeholder="Course Code"
          />
          <Input 
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="Course Name"
          />
          <Button onClick={handleAddCourseCode} className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Course
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseCodes.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CourseCodeManager;
