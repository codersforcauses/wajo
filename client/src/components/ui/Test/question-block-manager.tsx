import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlignJustifyIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Control, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchData } from "@/hooks/use-fetch-data";
import { Question } from "@/types/question";

type Props = {
  formControl: Control<any>;
};

/**
 * The `QuestionBlockManager` component provides an interface to manage a list of question blocks
 * with drag-and-drop functionality for reordering blocks.
 *
 * **Features:**
 * - Drag-and-drop reordering using DnD Kit.
 * - Search and filter questions to add to blocks.
 * - Interactive form integration using React Hook Form.
 * - Dynamic addition and removal of blocks and questions.
 *
 * **DnD Kit Documentation and Resources:**
 * - [DnD Kit Documentation](https://docs.dndkit.com/)
 * - [Implementation Example](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/story/presets-sortable-vertical--drag-handle)
 * - [Dragging Animation Issue with Containers of Different Heights](https://github.com/clauderic/dnd-kit/issues/117)
 *
 * @param {Props} props - The component props.
 * @param {Control<any>} props.formControl - React Hook Form control for managing the form state.
 */
export function QuestionBlockManager({ formControl }: Props) {
  const {
    fields: blocks,
    append: appendBlock,
    remove: removeBlock,
    move: moveBlock,
  } = useFieldArray({
    control: formControl,
    name: "blocks",
    keyName: "_id",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block._id === active.id);
      const newIndex = blocks.findIndex((block) => block._id === over.id);
      moveBlock(oldIndex, newIndex);
    }
  };

  const requiredStar = <span className="text-red-500">*</span>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg">Question Blocks {requiredStar}</h3>
          <span className="flex items-center text-xs text-gray-400">
            You can sort the Question Blocks and Questions with icon{" "}
            <AlignJustifyIcon className="ms-1" size={10} />
          </span>
        </div>
        <Button
          className="me-4"
          type="button"
          onClick={() => appendBlock({ id: blocks.length + 1, questions: [] })}
        >
          Add Block
        </Button>
      </div>
      {/* Blocks */}
      <FormField
        control={formControl}
        name="blocks"
        render={({ fieldState }) => (
          <FormItem>
            <FormControl>
              <div className="rounded-md bg-white p-4 shadow-md">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map((block) => block._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {/* Block Questions */}
                    {blocks.map((block, blockIndex) => (
                      <FormField
                        key={block._id}
                        control={formControl}
                        name={`blocks.${blockIndex}.questions`}
                        render={({ fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <SortableBlock
                                key={block._id}
                                id={block._id}
                                formControl={formControl}
                                blockIndex={blockIndex}
                                removeBlock={removeBlock}
                              />
                            </FormControl>
                            {fieldState.error?.message && <FormMessage />}
                          </FormItem>
                        )}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </FormControl>
            {fieldState.error?.message && <FormMessage />}
          </FormItem>
        )}
      />
    </div>
  );
}

interface SortableBlockProps {
  id: string;
  formControl: Control<any>;
  blockIndex: number;
  removeBlock: (index: number) => void;
}

/**
 * SortableBlock component represents a single draggable and sortable block.
 *
 * @param {SortableBlockProps} props - The props for the component.
 */
const SortableBlock: React.FC<SortableBlockProps> = ({
  id,
  formControl,
  blockIndex,
  removeBlock,
}) => {
  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
    move: moveQuestion,
  } = useFieldArray({
    control: formControl,
    name: `blocks.${blockIndex}.questions`,
    keyName: "_id",
  });

  const {
    data: questionList,
    isPending,
    isError,
  } = useFetchData<Question[]>({
    queryKey: ["questions.question-bank"],
    endpoint: "/questions/question-bank/",
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [isForceClose, setIsForceClose] = useState<boolean>(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = value
      ? questionList?.filter((question) =>
          question.name.toLowerCase().includes(value.toLowerCase()),
        )
      : [];
    setSearchResults(filtered as Question[]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
        setIsForceClose(true);
      } else {
        setIsForceClose(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q._id === active.id);
      const newIndex = questions.findIndex((q) => q._id === over.id);
      moveQuestion(oldIndex, newIndex);
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  const commonTableHeadClasses = "w-auto text-white text-nowrap";
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-2 rounded-md border border-gray-300 bg-gray-100 p-4"
    >
      <div className="flex items-center justify-between">
        <div {...listeners} className="me-2">
          <AlignJustifyIcon className="h-5 w-5 cursor-move" />
        </div>
        {/* Search Results */}
        <div className="relative w-full" ref={searchContainerRef}>
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search Question"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => handleSearch(searchTerm)}
            className="h-[40px] w-full rounded border border-gray-300 pl-10 text-gray-700"
          />
          {searchTerm && !isForceClose && (
            <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-md">
              {isPending || isError || searchResults?.length < 1 ? (
                <div className="p-2 text-center text-gray-500">
                  {isPending
                    ? "Loading..."
                    : isError
                      ? "Failed to fetch questions."
                      : "No results found."}
                </div>
              ) : (
                <ul>
                  {searchResults.map((question) => (
                    <li
                      key={question.id}
                      className="flex items-center justify-between border-b p-2 last:border-0 hover:bg-gray-100"
                    >
                      <span>{question.name}</span>
                      <Button
                        type="button"
                        onClick={() => appendQuestion(question)}
                      >
                        Add
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          className="ms-2"
          onClick={() => removeBlock(blockIndex)}
        >
          Remove
        </Button>
      </div>
      {/* Question Table */}
      <div className="space-y-4 p-0 pt-2">
        <div className="grid">
          <div className="overflow-hidden rounded-lg border border-black">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table className="w-full border-collapse text-left shadow-md">
                <TableHeader className="bg-black text-lg font-semibold">
                  <TableRow className="hover:bg-muted/0">
                    <TableHead className={commonTableHeadClasses}></TableHead>
                    <TableHead className={commonTableHeadClasses}>Id</TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      Name
                    </TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      Difficulty
                    </TableHead>
                    <TableHead className={commonTableHeadClasses}>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext
                    items={questions.map((q) => q._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {questions.map((field, index) => (
                      <SortableQuestionRow
                        key={field._id}
                        id={field._id}
                        question={field}
                        questionIndex={index}
                        removeQuestion={removeQuestion}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SortableQuestionProps {
  id: string;
  question: any;
  questionIndex: number;
  removeQuestion: (index: number) => void;
}

const SortableQuestionRow = ({
  id,
  question,
  questionIndex,
  removeQuestion,
}: SortableQuestionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.6 : 1,
  };

  const ques = question as Question;
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`divide-gray-200 border-black text-sm text-black ${
        isDragging ? "bg-gray-100" : ""
      }`}
    >
      <TableCell className="w-0 py-2">
        <div {...listeners} className="me-2">
          <AlignJustifyIcon className="h-5 w-5 cursor-move" />
        </div>
      </TableCell>
      <TableCell className="w-0 py-2">{ques.id}</TableCell>
      <TableCell className="w-full py-2">{ques.name}</TableCell>
      <TableCell className="w-0 py-2">{ques.diff_level}</TableCell>
      <TableCell className="w-0 py-2 text-right">
        <Button
          type="button"
          variant="destructive"
          onClick={() => removeQuestion(questionIndex)}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};
