import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileText, Search, Upload, Filter, Loader2, 
  BookOpen, AlertCircle, Star
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import MaterialUploadDialog from '@/components/MaterialUploadDialog';
import MaterialCard from '@/components/MaterialCard';
import { Material, materialsService, MaterialFilter } from '@/services/materialsService';
import { useLocation, useNavigate } from 'react-router-dom';

const Materials = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search params from URL or use defaults
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get('tab') || 'all';
  const queryFromUrl = searchParams.get('q') || '';
  const subjectFromUrl = searchParams.get('subject') || '';
  const typeFromUrl = searchParams.get('type') || '';
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [searchInputValue, setSearchInputValue] = useState(queryFromUrl);
  const [subjectFilter, setSubjectFilter] = useState(subjectFromUrl);
  const [typeFilter, setTypeFilter] = useState(typeFromUrl);
  const [isFiltersVisible, setIsFiltersVisible] = useState(
    !!(subjectFromUrl || typeFromUrl)
  );
  
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [myMaterials, setMyMaterials] = useState<Material[]>([]);
  const [savedMaterials, setSavedMaterials] = useState<Material[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);

  // Update URL with current filters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (activeTab !== 'all') {
      params.set('tab', activeTab);
    }
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (subjectFilter) {
      params.set('subject', subjectFilter);
    }
    
    if (typeFilter) {
      params.set('type', typeFilter);
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    navigate(`/materials${newUrl}`, { replace: true });
  }, [activeTab, searchQuery, subjectFilter, typeFilter, navigate]);

  // Function to load materials based on active tab
  const loadMaterials = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Create filter object
      const filters: MaterialFilter = {
        searchQuery: searchQuery || undefined,
        subject: subjectFilter || undefined,
        fileType: typeFilter || undefined
      };
      
      // Load appropriate materials based on active tab
      switch (activeTab) {
        case 'all':
          // Use the new method to get materials with ratings
          const materials = await materialsService.getAllMaterialsWithRatings(filters);
          setAllMaterials(materials);
        
        // Extract unique subjects for filter - fix the type by explicitly casting to string[]
        const subjects = [...new Set(materials.map(m => m.subject))];
        setUniqueSubjects(subjects as string[]);
        break;
          
        case 'my-uploads':
          const myMats = await materialsService.getMyMaterials();
          setMyMaterials(myMats);
          break;
          
        case 'saved':
          const savedMats = await materialsService.getSavedMaterials();
          setSavedMaterials(savedMats);
          break;
      }
    } catch (error) {
      console.error("Error loading materials:", error);
      toast.error("Failed to load materials");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, subjectFilter, typeFilter]);

  // Apply URL params whenever they change
  useEffect(() => {
    updateUrlParams();
  }, [activeTab, searchQuery, subjectFilter, typeFilter, updateUrlParams]);

  // Load materials on initial render and when filters/tab change
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInputValue);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset filters when changing tabs
    setSearchQuery('');
    setSearchInputValue('');
    setSubjectFilter('');
    setTypeFilter('');
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchInputValue('');
    setSubjectFilter('');
    setTypeFilter('');
  };

  // Get materials to display based on active tab
  const getMaterialsToDisplay = () => {
    switch (activeTab) {
      case 'my-uploads':
        return myMaterials;
      case 'saved':
        return savedMaterials;
      default:
        return allMaterials;
    }
  };

  // Render appropriate content based on loading state and data availability
  const renderContent = () => {
    const materialsToDisplay = getMaterialsToDisplay();
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium">Loading materials...</p>
        </div>
      );
    }
    
    if (materialsToDisplay.length === 0) {
      if (activeTab === 'all' && (searchQuery || subjectFilter || typeFilter)) {
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Matching Materials</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        );
      }
      
      if (activeTab === 'my-uploads') {
        return (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Uploads Yet</h3>
            <p className="text-muted-foreground mb-6">Share your study materials with other students</p>
            <MaterialUploadDialog onSuccess={loadMaterials} />
          </div>
        );
      }
      
      if (activeTab === 'saved') {
        return (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Saved Materials</h3>
            <p className="text-muted-foreground mb-6">Materials you save will appear here</p>
            <Button variant="outline" onClick={() => handleTabChange('all')}>Browse Materials</Button>
          </div>
        );
      }
      
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Materials Available</h3>
          <p className="text-muted-foreground mb-6">Be the first to upload study materials</p>
          <MaterialUploadDialog onSuccess={loadMaterials} />
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materialsToDisplay.map((material) => (
          <MaterialCard 
            key={material.id} 
            material={material}
            onDelete={loadMaterials}
            onSaveChange={loadMaterials}
            showDeleteAction={activeTab === 'my-uploads'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Materials</h1>
          <p className="text-muted-foreground">Explore and share academic resources with fellow students</p>
        </div>
        <MaterialUploadDialog onSuccess={loadMaterials} />
      </div>

      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search materials by title, subject, or keywords..." 
            className="pl-10"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
          />
          <Button 
            type="submit" 
            className="absolute right-1 top-1 h-[32px] px-3" 
            size="sm"
          >
            Search
          </Button>
        </form>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Materials</TabsTrigger>
            <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>
        </div>
        
        {isFiltersVisible && activeTab === 'all' && (
          <div className="bg-muted/30 p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Subject</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">Material Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="notes">Lecture Notes</SelectItem>
                  <SelectItem value="study_guide">Study Guide</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="reference">Reference</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="mb-0.5">
                Reset
              </Button>
            </div>
          </div>
        )}

        <TabsContent value="all" className="mt-0">
          {renderContent()}
        </TabsContent>

        <TabsContent value="my-uploads" className="mt-0">
          {renderContent()}
        </TabsContent>

        <TabsContent value="saved" className="mt-0">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Materials;
