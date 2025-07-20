import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff,
  GripVertical,
  Trash2
} from "lucide-react";

interface Element {
  id: string;
  type: string;
  content: string;
  className: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  children: Element[];
  events: Record<string, string>;
}

interface ElementTreeProps {
  elements: Element[];
  selectedElementId: string | null;
  onElementSelect: (element: Element) => void;
  onElementMove: (elementId: string, targetParentId: string, position: number) => void;
  onElementDelete: (elementId: string) => void;
  draggedElementId: string | null;
  onDragStart: (elementId: string) => void;
  onDragEnd: () => void;
}

interface TreeNodeProps {
  element: Element;
  depth: number;
  selectedElementId: string | null;
  onElementSelect: (element: Element) => void;
  onElementMove: (elementId: string, targetParentId: string, position: number) => void;
  onElementDelete: (elementId: string) => void;
  draggedElementId: string | null;
  onDragStart: (elementId: string) => void;
  onDragEnd: () => void;
}

function TreeNode({
  element,
  depth,
  selectedElementId,
  onElementSelect,
  onElementMove,
  onElementDelete,
  draggedElementId,
  onDragStart,
  onDragEnd
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const isSelected = selectedElementId === element.id;
  const hasChildren = element.children.length > 0;
  const isDragging = draggedElementId === element.id;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', element.id);
    onDragStart(element.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedElementId && draggedElementId !== element.id) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== element.id) {
      onElementMove(draggedId, element.id, element.children.length);
    }
    onDragEnd();
  };

  const getElementDisplayName = (element: Element) => {
    if (element.content && element.content.length > 0) {
      return `${element.type} - "${element.content.slice(0, 20)}${element.content.length > 20 ? '...' : ''}"`;
    }
    return element.type;
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-100 border-l-2 border-blue-500' : ''
        } ${isDragOver ? 'bg-blue-50 border border-blue-300' : ''} ${
          isDragging ? 'opacity-50' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onElementSelect(element)}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex items-center flex-1 min-w-0">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-4 h-4 p-0 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          ) : (
            <div className="w-5" />
          )}
          
          <GripVertical className="w-3 h-3 text-gray-400 mr-2 cursor-grab" />
          
          <span className="text-sm font-medium text-gray-700 mr-2">
            {element.type}
          </span>
          
          {element.content && (
            <span className="text-xs text-gray-500 truncate">
              "{element.content.slice(0, 20)}{element.content.length > 20 ? '...' : ''}"
            </span>
          )}
        </div>

        {element.id !== 'root' && (
          <Button
            variant="ghost"
            size="sm"
            className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onElementDelete(element.id);
            }}
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {element.children.map((child) => (
            <TreeNode
              key={child.id}
              element={child}
              depth={depth + 1}
              selectedElementId={selectedElementId}
              onElementSelect={onElementSelect}
              onElementMove={onElementMove}
              onElementDelete={onElementDelete}
              draggedElementId={draggedElementId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ElementTree({
  elements,
  selectedElementId,
  onElementSelect,
  onElementMove,
  onElementDelete,
  draggedElementId,
  onDragStart,
  onDragEnd
}: ElementTreeProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Element Tree</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="group">
            {elements.map((element) => (
              <TreeNode
                key={element.id}
                element={element}
                depth={0}
                selectedElementId={selectedElementId}
                onElementSelect={onElementSelect}
                onElementMove={onElementMove}
                onElementDelete={onElementDelete}
                draggedElementId={draggedElementId}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
