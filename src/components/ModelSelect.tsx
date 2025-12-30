'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { modelList } from '@/data/modelEvaluationData'; // Import from new data file

type ModelSelectProps = {
  selected: string;
  onChange: (value: string) => void;
};

const ModelSelect = ({ selected, onChange }: ModelSelectProps) => {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger className="w-full p-3 h-auto text-lg font-semibold focus:ring-2 focus:ring-purple-500">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {modelList.map((model) => (
          <SelectItem key={model} value={model} className="text-md">
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
