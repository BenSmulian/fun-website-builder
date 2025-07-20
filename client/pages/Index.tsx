import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TailwindEditor } from "@/components/TailwindEditor";
import { ElementTree } from "@/components/ElementTree";
import { 
  Trash2, 
  Copy, 
  Plus, 
  Code, 
  Eye, 
  Settings,
  MousePointer,
  Move,
  Type,
  Square,
  Image,
      Link as LinkIcon,
  Download,
  ExternalLink,
  Monitor,
  X
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

interface SelectedElement {
  id: string;
  element: Element;
}

interface Component {
  id: string;
  name: string;
  description: string;
  template: Element;
  createdAt: Date;
}

export default function Index() {
    const [elements, setElements] = useState<Element[]>([
    {
      id: 'root',
      type: 'div',
      content: '',
      className: 'min-h-screen bg-white',
      styles: {},
      attributes: {},
            children: [
        {
          id: 'content-wrapper',
          type: 'div',
          content: '',
          className: 'p-8',
          styles: {},
          attributes: {},
          children: [
            {
              id: 'demo-text',
              type: 'h1',
              content: 'Welcome to Visual Builder',
              className: 'text-4xl font-bold text-gray-900 mb-4',
              styles: {},
              attributes: {},
              children: [],
              events: {}
            },
            {
              id: 'demo-paragraph',
              type: 'p',
              content: 'Click on any element to select and edit it. Use the config panel on the right to modify properties. The page has zero padding by default - add a wrapper div with padding if needed.',
              className: 'text-lg text-gray-600 max-w-2xl',
              styles: {},
              attributes: {},
              children: [],
              events: {}
            }
          ],
          events: {}
        }
      ],
      events: {}
    }
  ]);

  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [tailwindInput, setTailwindInput] = useState('');
    const [elementTypeInput, setElementTypeInput] = useState('');
  const [isEditingElementType, setIsEditingElementType] = useState(false);
    const [copiedElement, setCopiedElement] = useState<Element | null>(null);
    const [components, setComponents] = useState<Component[]>([]);
  const [showComponentCreator, setShowComponentCreator] = useState(false);
  const [newComponentName, setNewComponentName] = useState('');
  const [newComponentDescription, setNewComponentDescription] = useState('');
  const [currentPage, setCurrentPage] = useState('Home');
  const [pages, setPages] = useState<Record<string, Element[]>>({
    'Home': elements
  });
    const [showPageCreator, setShowPageCreator] = useState(false);
  const [newPageName, setNewPageName] = useState('');
      const [selectedTool, setSelectedTool] = useState<'select' | 'move'>('select');
  const [showElementTree, setShowElementTree] = useState(true);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

    // Update tailwind input when selection changes
  useEffect(() => {
    if (selectedElement) {
      setTailwindInput(selectedElement.element.className);
      if (!isEditingElementType) {
        setElementTypeInput(selectedElement.element.type);
      }
    }
  }, [selectedElement, isEditingElementType]);

  // Find element by ID in the tree
  const findElement = useCallback((elements: Element[], id: string): Element | null => {
    for (const element of elements) {
      if (element.id === id) return element;
      const found = findElement(element.children, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Update element in the tree
  const updateElement = useCallback((elements: Element[], id: string, updates: Partial<Element>): Element[] => {
    return elements.map(element => {
      if (element.id === id) {
        return { ...element, ...updates };
      }
      return {
        ...element,
        children: updateElement(element.children, id, updates)
      };
    });
  }, []);

    // Handle element selection
  const handleElementClick = useCallback((e: React.MouseEvent, element: Element) => {
    e.stopPropagation();
    if (selectedTool === 'select') {
      setSelectedElement({ id: element.id, element });
    }
    // In move mode, clicking doesn't select, only dragging works
  }, [selectedTool]);

  // Handle tailwind class updates
  const handleTailwindUpdate = useCallback((newClasses: string) => {
    setTailwindInput(newClasses);
    if (selectedElement) {
      setElements(prev => updateElement(prev, selectedElement.id, { className: newClasses }));
    }
  }, [selectedElement, updateElement]);

    // Handle element type changes
  const handleElementTypeChange = useCallback((newType: string) => {
    setElementTypeInput(newType);
    setIsEditingElementType(true);
    if (selectedElement) {
      setElements(prev => updateElement(prev, selectedElement.id, { type: newType }));
    }
    // Clear editing flag after a short delay
    setTimeout(() => setIsEditingElementType(false), 100);
  }, [selectedElement, updateElement]);

  // Handle content updates
  const handleContentUpdate = useCallback((newContent: string) => {
    if (selectedElement) {
      setElements(prev => updateElement(prev, selectedElement.id, { content: newContent }));
    }
  }, [selectedElement, updateElement]);

  // Copy element (Ctrl+C)
  const handleCopy = useCallback(() => {
    if (selectedElement) {
      setCopiedElement(selectedElement.element);
    }
  }, [selectedElement]);

  // Paste element (Ctrl+V)
  const handlePaste = useCallback(() => {
    if (copiedElement && selectedElement) {
      const newElement = {
        ...copiedElement,
        id: `${copiedElement.type}-${Date.now()}`,
      };
      setElements(prev => updateElement(prev, selectedElement.id, {
        children: [...selectedElement.element.children, newElement]
      }));
    }
  }, [copiedElement, selectedElement, updateElement]);

  // Delete element
  const handleDelete = useCallback(() => {
    if (selectedElement && selectedElement.id !== 'root') {
      setElements(prev => {
        const removeElement = (elements: Element[], id: string): Element[] => {
          return elements.filter(el => el.id !== id).map(el => ({
            ...el,
            children: removeElement(el.children, id)
          }));
        };
        return removeElement(prev, selectedElement.id);
      });
      setSelectedElement(null);
    }
  }, [selectedElement]);

    // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewMode) {
        e.preventDefault();
        setPreviewMode(false);
        setSelectedElement(null);
      } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        handleDelete();
      }
    };

        window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy, handlePaste, handleDelete, previewMode]);

  

  // Add new element
  const addElement = useCallback((type: string) => {
    if (selectedElement) {
      const newElement: Element = {
        id: `${type}-${Date.now()}`,
        type,
                content: '',
        className: type === 'div' ? 'p-4 border border-gray-200' : 
                  type === 'img' ? 'w-full h-32 object-cover' :
                  'text-base',
        styles: {},
        attributes: type === 'img' ? { src: 'https://via.placeholder.com/400x200', alt: 'Placeholder' } : {},
        children: [],
        events: {}
      };

      setElements(prev => updateElement(prev, selectedElement.id, {
        children: [...selectedElement.element.children, newElement]
      }));
    }
    }, [selectedElement, updateElement]);

  // Create component from selected element
  const createComponent = useCallback(() => {
    if (!selectedElement || !newComponentName.trim()) return;

    const newComponent: Component = {
      id: `component-${Date.now()}`,
      name: newComponentName.trim(),
      description: newComponentDescription.trim(),
      template: { ...selectedElement.element },
      createdAt: new Date()
    };

    setComponents(prev => [...prev, newComponent]);
    setShowComponentCreator(false);
    setNewComponentName('');
    setNewComponentDescription('');
  }, [selectedElement, newComponentName, newComponentDescription]);

  // Add component to canvas
  const addComponentToCanvas = useCallback((component: Component) => {
    if (selectedElement) {
      const newElement: Element = {
        ...component.template,
        id: `${component.template.type}-${Date.now()}`,
      };
      setElements(prev => updateElement(prev, selectedElement.id, {
        children: [...selectedElement.element.children, newElement]
      }));
    }
    }, [selectedElement, updateElement]);

  // Page management functions
  const createPage = useCallback(() => {
    if (!newPageName.trim()) return;

        const defaultPageElement: Element = {
      id: 'root',
      type: 'div',
      content: '',
      className: 'min-h-screen bg-white',
      styles: {},
      attributes: {},
            children: [
        {
          id: `wrapper-${Date.now()}`,
          type: 'div',
          content: '',
          className: 'p-8',
          styles: {},
          attributes: {},
          children: [
                        {
              id: `title-${Date.now()}`,
              type: 'h1',
              content: '',
              className: 'text-4xl font-bold text-gray-900 mb-4',
              styles: {},
              attributes: {},
              children: [],
              events: {}
            }
          ],
          events: {}
        }
      ],
      events: {}
    };

    setPages(prev => ({ ...prev, [newPageName]: [defaultPageElement] }));
    setCurrentPage(newPageName);
    setElements([defaultPageElement]);
    setShowPageCreator(false);
    setNewPageName('');
    setSelectedElement(null);
  }, [newPageName]);

  const switchPage = useCallback((pageName: string) => {
    setPages(prev => ({ ...prev, [currentPage]: elements }));
    setCurrentPage(pageName);
    setElements(pages[pageName] || []);
    setSelectedElement(null);
    }, [currentPage, elements, pages]);

  // Move element in tree
  const moveElement = useCallback((elementId: string, targetParentId: string, position: number) => {
    setElements(prev => {
      // First, remove the element from its current position
      const removeFromTree = (elements: Element[], idToRemove: string): { elements: Element[], removed: Element | null } => {
        const result: Element[] = [];
        let removedElement: Element | null = null;

        for (const element of elements) {
          if (element.id === idToRemove) {
            removedElement = element;
          } else {
            const { elements: newChildren, removed } = removeFromTree(element.children, idToRemove);
            result.push({ ...element, children: newChildren });
            if (removed) removedElement = removed;
          }
        }

        return { elements: result, removed: removedElement };
      };

      // Then, add it to the new position
      const addToTree = (elements: Element[], targetId: string, elementToAdd: Element, pos: number): Element[] => {
        return elements.map(element => {
          if (element.id === targetId) {
            const newChildren = [...element.children];
            newChildren.splice(pos, 0, elementToAdd);
            return { ...element, children: newChildren };
          }
          return { ...element, children: addToTree(element.children, targetId, elementToAdd, pos) };
        });
      };

      const { elements: withoutMoved, removed } = removeFromTree(prev, elementId);
      if (removed) {
        return addToTree(withoutMoved, targetParentId, removed, position);
      }
      return prev;
    });
  }, []);

  // Handle element selection from tree
  const handleTreeElementSelect = useCallback((element: Element) => {
    setSelectedElement({ id: element.id, element });
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((elementId: string) => {
    if (selectedTool === 'move') {
      setDraggedElementId(elementId);
    }
  }, [selectedTool]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedElementId(null);
  }, []);

  // Update toolbar button handlers
  const handleToolSelect = useCallback((tool: 'select' | 'move') => {
    setSelectedTool(tool);
    if (tool === 'select') {
      setDraggedElementId(null);
    }
      }, []);

  // Preview functionality
  const togglePreview = useCallback(() => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      setSelectedElement(null);
    }
  }, [previewMode]);

  // Export functionality
  const generateHTMLExport = useCallback(() => {
    const exportElement = (element: Element, depth: number = 0): string => {
      const indent = '  '.repeat(depth);
      const TagName = element.type;
      const className = element.className ? ` class="${element.className}"` : '';

      // Build attributes string
      let attributesStr = '';
      Object.entries(element.attributes).forEach(([key, value]) => {
        if (key !== 'class') {
          attributesStr += ` ${key}="${value}"`;
        }
      });

      // Build events string for inline handlers (simplified)
      let eventsStr = '';
      Object.entries(element.events).forEach(([eventName, code]) => {
        if (code.trim()) {
          const eventAttr = eventName.toLowerCase();
          eventsStr += ` ${eventAttr}="${code.replace(/"/g, '&quot;')}"`;
        }
      });

      const openTag = `<${TagName}${className}${attributesStr}${eventsStr}>`;
      const closeTag = `</${TagName}>`;

      if (element.children.length === 0) {
        return `${indent}${openTag}${element.content}${closeTag}`;
      } else {
        const childrenHTML = element.children
          .map(child => exportElement(child, depth + 1))
          .join('\n');
        return `${indent}${openTag}\n${element.content ? `${indent}  ${element.content}\n` : ''}${childrenHTML}\n${indent}${closeTag}`;
      }
    };

    const htmlContent = elements.map(element => exportElement(element)).join('\n');

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentPage}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${htmlContent}
</body>
</html>`;

    return fullHTML;
  }, [elements, currentPage]);

  const exportToFile = useCallback(() => {
    const htmlContent = generateHTMLExport();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateHTMLExport, currentPage]);

  const copyToClipboard = useCallback(async () => {
    try {
      const htmlContent = generateHTMLExport();
      await navigator.clipboard.writeText(htmlContent);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, [generateHTMLExport]);

  // Render element recursively
  const renderElement = useCallback((element: Element): JSX.Element => {
    const isSelected = selectedElement?.id === element.id;
    const TagName = element.type as keyof JSX.IntrinsicElements;

    // Create event handlers from custom events
    const createEventHandler = (eventCode: string) => {
      if (!eventCode.trim()) return undefined;
      return (e: any) => {
        try {
          // Create a function with the event code
          const eventFunction = new Function('e', 'event', 'element', eventCode);
          eventFunction(e, e, element);
        } catch (error) {
          console.error('Event handler error:', error);
        }
      };
    };

    const elementProps: any = {
      key: element.id,
      className: `${element.className} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'}`,
      onClick: (e: React.MouseEvent) => {
        handleElementClick(e, element);
        // Execute custom onClick event if exists
        if (element.events.onClick) {
          createEventHandler(element.events.onClick)?.(e);
        }
      },
      style: {
        ...element.styles,
        cursor: selectedTool === 'move' ? 'grab' : 'pointer',
        opacity: draggedElementId === element.id ? 0.5 : 1
      },
      ...element.attributes
    };

    // Add drag functionality for move mode
    if (selectedTool === 'move') {
      elementProps.draggable = true;
      elementProps.onDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', element.id);
        handleDragStart(element.id);
      };
      elementProps.onDragEnd = handleDragEnd;
      elementProps.onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
      };
      elementProps.onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId && draggedId !== element.id) {
          moveElement(draggedId, element.id, element.children.length);
        }
        handleDragEnd();
      };
    }

    // Add other event handlers
    if (element.events.onMouseEnter) {
      elementProps.onMouseEnter = createEventHandler(element.events.onMouseEnter);
    }
    if (element.events.onChange) {
      elementProps.onChange = createEventHandler(element.events.onChange);
    }

    return (
      <TagName {...elementProps}>
        {element.content}
        {element.children.map(child => renderElement(child))}
      </TagName>
    );
  }, [selectedElement, handleElementClick, selectedTool, draggedElementId, handleDragStart, handleDragEnd, moveElement]);

  return (
            <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
      {/* Left Sidebar - Element Tree */}
      {showElementTree && !previewMode && (
        <div className="w-80 min-w-[280px] max-w-[400px] bg-white border-r border-gray-200 flex flex-col">
          <div className="h-14 border-b border-gray-200 flex items-center px-4">
            <span className="font-medium">Elements</span>
          </div>
          <div className="flex-1">
            <ElementTree
              elements={elements}
              selectedElementId={selectedElement?.id || null}
              onElementSelect={handleTreeElementSelect}
              onElementMove={moveElement}
              onElementDelete={handleDelete}
              draggedElementId={draggedElementId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>
      )}

            {/* Main Canvas Area */}
      <div className="flex-1 min-w-0 flex flex-col">
                        {/* Toolbar */}
        {!previewMode && (
                    <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 overflow-x-auto min-w-0">
                        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Preview & Export - Priority buttons */}
          <Button
            variant={previewMode ? 'default' : 'ghost'}
            size="sm"
            onClick={togglePreview}
          >
            <Monitor className="w-4 h-4 mr-1" />
            {previewMode ? 'Exit' : 'Preview'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Separator orientation="vertical" className="h-6" />

          {/* Page Management */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Label className="text-sm font-medium">Page:</Label>
            <select
              value={currentPage}
              onChange={(e) => switchPage(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {Object.keys(pages).map(pageName => (
                <option key={pageName} value={pageName}>{pageName}</option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPageCreator(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Page
            </Button>
                    </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowElementTree(!showElementTree)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {showElementTree ? 'Hide' : 'Show'} Tree
          </Button>
          <Separator orientation="vertical" className="h-6" />
                    <Button
            variant={selectedTool === 'select' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleToolSelect('select')}
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Select
          </Button>
          <Button
            variant={selectedTool === 'move' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleToolSelect('move')}
          >
            <Move className="w-4 h-4 mr-2" />
            Move
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => addElement('div')}
            disabled={!selectedElement}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Container
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => addElement('p')}
            disabled={!selectedElement}
          >
            <Type className="w-4 h-4 mr-2" />
            Add Text
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => addElement('img')}
            disabled={!selectedElement}
          >
                        <Image className="w-4 h-4 mr-2" />
            Add Image
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComponentCreator(true)}
            disabled={!selectedElement}
          >
            <Square className="w-4 h-4 mr-2" />
            Create Component
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleCopy}
            disabled={!selectedElement}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handlePaste}
            disabled={!copiedElement || !selectedElement}
          >
            Paste
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleDelete}
            disabled={!selectedElement || selectedElement.id === 'root'}
          >
            <Trash2 className="w-4 h-4 mr-2" />
                        Delete
          </Button>
          
            </div>
          </div>
        )}

                {/* Canvas */}
        <div className={`flex-1 overflow-auto bg-white ${previewMode ? '' : 'm-4 border border-gray-200 rounded-lg'}`}>
          <div ref={canvasRef} className="min-h-full">
            {elements.map(element => renderElement(element))}
          </div>

                    {/* Floating Exit Button for Preview Mode */}
          {previewMode && (
            <div className="fixed top-4 right-4 z-50">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <Button
                  onClick={togglePreview}
                  variant="default"
                  size="sm"
                  className="mb-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Exit Preview
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  or press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

            {/* Right Config Panel */}
      {!previewMode && (
        <div className="w-80 min-w-[280px] max-w-[400px] bg-white border-l border-gray-200 flex flex-col">
        <div className="h-14 border-b border-gray-200 flex items-center px-4">
          <Settings className="w-4 h-4 mr-2" />
          <span className="font-medium">Properties</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {selectedElement ? (
              <>
                {/* Element Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Element Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="element-type" className="text-xs">Element Type</Label>
                                            <Input
                        id="element-type"
                        value={elementTypeInput}
                        onChange={(e) => handleElementTypeChange(e.target.value)}
                        onFocus={() => setIsEditingElementType(true)}
                        onBlur={() => setIsEditingElementType(false)}
                        className="mt-1"
                        placeholder="div, p, h1, span..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="element-id" className="text-xs">Element ID</Label>
                      <Input
                        id="element-id"
                        value={selectedElement.id}
                        disabled
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Content */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={selectedElement.element.content}
                      onChange={(e) => handleContentUpdate(e.target.value)}
                      placeholder="Element content..."
                      className="min-h-20"
                    />
                  </CardContent>
                </Card>

                {/* TailwindCSS Classes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">TailwindCSS Classes</CardTitle>
                  </CardHeader>
                                    <CardContent>
                    <TailwindEditor
                      value={tailwindInput}
                      onChange={handleTailwindUpdate}
                      placeholder="Enter Tailwind classes..."
                      className="min-h-32"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Type Tailwind classes separated by spaces. Use Tab or Enter to accept suggestions.
                    </p>
                  </CardContent>
                </Card>

                {/* Attributes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Attributes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedElement.element.type === 'img' && (
                      <>
                        <div>
                          <Label htmlFor="src" className="text-xs">Source URL</Label>
                          <Input
                            id="src"
                            value={selectedElement.element.attributes.src || ''}
                            onChange={(e) => {
                              setElements(prev => updateElement(prev, selectedElement.id, {
                                attributes: { ...selectedElement.element.attributes, src: e.target.value }
                              }));
                            }}
                            className="mt-1"
                            placeholder="Image URL..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="alt" className="text-xs">Alt Text</Label>
                          <Input
                            id="alt"
                            value={selectedElement.element.attributes.alt || ''}
                            onChange={(e) => {
                              setElements(prev => updateElement(prev, selectedElement.id, {
                                attributes: { ...selectedElement.element.attributes, alt: e.target.value }
                              }));
                            }}
                            className="mt-1"
                            placeholder="Alt text..."
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                                {/* Events */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="click-event" className="text-xs">onClick Event</Label>
                      <Textarea
                        id="click-event"
                        value={selectedElement.element.events.onClick || ''}
                        onChange={(e) => {
                          setElements(prev => updateElement(prev, selectedElement.id, {
                            events: { ...selectedElement.element.events, onClick: e.target.value }
                          }));
                        }}
                        placeholder="console.log('Element clicked!');"
                        className="mt-1 font-mono text-xs"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hover-event" className="text-xs">onMouseEnter Event</Label>
                      <Textarea
                        id="hover-event"
                        value={selectedElement.element.events.onMouseEnter || ''}
                        onChange={(e) => {
                          setElements(prev => updateElement(prev, selectedElement.id, {
                            events: { ...selectedElement.element.events, onMouseEnter: e.target.value }
                          }));
                        }}
                        placeholder="console.log('Mouse entered!');"
                        className="mt-1 font-mono text-xs"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="change-event" className="text-xs">onChange Event (for inputs)</Label>
                      <Textarea
                        id="change-event"
                        value={selectedElement.element.events.onChange || ''}
                        onChange={(e) => {
                          setElements(prev => updateElement(prev, selectedElement.id, {
                            events: { ...selectedElement.element.events, onChange: e.target.value }
                          }));
                        }}
                        placeholder="console.log('Value changed:', e.target.value);"
                        className="mt-1 font-mono text-xs"
                        rows={2}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Write JavaScript code that will be executed on the event. Available variables: event (e), element.
                    </p>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleCopy}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Element
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleDelete}
                      disabled={selectedElement.id === 'root'}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Element
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select an element to edit its properties</p>
              </div>
                        )}

            {/* Components Library */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Components Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {components.length > 0 ? (
                  components.map((component) => (
                    <div
                      key={component.id}
                      className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => addComponentToCanvas(component)}
                    >
                      <div className="font-medium text-sm">{component.name}</div>
                      {component.description && (
                        <div className="text-xs text-gray-500 mt-1">{component.description}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No components created yet</p>
                )}
              </CardContent>
            </Card>
          </div>
                </ScrollArea>
      </div>
      )}

      {/* Component Creation Dialog */}
      {showComponentCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Component</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="component-name" className="text-sm">Component Name</Label>
                <Input
                  id="component-name"
                  value={newComponentName}
                  onChange={(e) => setNewComponentName(e.target.value)}
                  placeholder="Enter component name..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="component-description" className="text-sm">Description (optional)</Label>
                <Textarea
                  id="component-description"
                  value={newComponentDescription}
                  onChange={(e) => setNewComponentDescription(e.target.value)}
                  placeholder="Describe what this component does..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={createComponent}
                disabled={!newComponentName.trim()}
                className="flex-1"
              >
                Create Component
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowComponentCreator(false);
                  setNewComponentName('');
                  setNewComponentDescription('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
            )}

      {/* Page Creation Dialog */}
      {showPageCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Page</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="page-name" className="text-sm">Page Name</Label>
                <Input
                  id="page-name"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  placeholder="Enter page name..."
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={createPage}
                disabled={!newPageName.trim()}
                className="flex-1"
              >
                Create Page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPageCreator(false);
                  setNewPageName('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
            )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Export Project</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Export your project as HTML file with embedded Tailwind CSS.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    exportToFile();
                    setShowExportDialog(false);
                  }}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download HTML File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    copyToClipboard();
                    setShowExportDialog(false);
                  }}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const htmlContent = generateHTMLExport();
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(htmlContent);
                      newWindow.document.close();
                    }
                    setShowExportDialog(false);
                  }}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
