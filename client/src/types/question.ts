interface Question {
  name: string;
  category: string;
  difficulty: string;
}

interface DatagridProps {
  datacontext: Question[];
  onDataChange: (updatedData: Question[]) => void;
  changePage: number;
}
