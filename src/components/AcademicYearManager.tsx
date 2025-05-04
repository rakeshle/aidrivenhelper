
import { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AcademicYearManagerProps {
  academicYears: Tables<"academic_years">[];
  onAcademicYearAdded: (year: Tables<"academic_years">) => void;
}

const AcademicYearManager = ({ academicYears, onAcademicYearAdded }: AcademicYearManagerProps) => {
  const [newAcademicYear, setNewAcademicYear] = useState('');
  const { toast } = useToast();

  const handleAddAcademicYear = async () => {
    if (!newAcademicYear) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an academic year",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('academic_years')
        .insert({ year: newAcademicYear })
        .select()
        .single();

      if (error) throw error;

      onAcademicYearAdded(data);
      setNewAcademicYear('');
      toast({
        title: "Academic Year Added",
        description: `${data.year} has been added successfully`,
      });
    } catch (error) {
      console.error('Error adding academic year:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add academic year. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Years</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            value={newAcademicYear}
            onChange={(e) => setNewAcademicYear(e.target.value)}
            placeholder="Enter academic year"
          />
          <Button onClick={handleAddAcademicYear}>
            <Plus className="h-4 w-4 mr-2" /> Add
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {academicYears.map((year) => (
              <TableRow key={year.id}>
                <TableCell>{year.year}</TableCell>
                <TableCell>{new Date(year.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AcademicYearManager;
