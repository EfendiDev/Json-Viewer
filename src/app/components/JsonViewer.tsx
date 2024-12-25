'use client';

import React, { useState } from 'react';
import { AlertCircle, Copy, FileCode, Link, Trash2, Minimize2, Maximize2, ChevronRight, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// TreeNode Component
interface TreeNodeProps {
  name: string;
  value: any;
  depth?: number;
}

const TreeNode = ({ name, value, depth = 0 }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [nestedJson, setNestedJson] = useState(null);

  const isObject = value !== null && typeof value === 'object';
  const paddingLeft = `${depth * 12}px`;

  const handleCopy = async (text, event) => {
    event.stopPropagation();
    try {
      const textToCopy = typeof text === 'object' ? JSON.stringify(text, null, 2) : String(text);
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const getValueStyle = (val) => {
    if (val === null) return 'text-red-500 dark:text-red-400';
    switch (typeof val) {
      case 'number': return 'text-blue-600 dark:text-blue-400';
      case 'string': return 'text-emerald-600 dark:text-emerald-400';
      case 'boolean': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-slate-900 dark:text-slate-100';
    }
  };

  const isJsonString = (str) => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  };

  const handleValueClick = (val, event) => {
    event.stopPropagation();
    if (typeof val === 'string' && isJsonString(val)) {
      try {
        const parsed = JSON.parse(val);
        setNestedJson(parsed);
        setIsExpanded(true);
      } catch {
        handleCopy(val, event);
      }
    } else {
      handleCopy(val, event);
    }
  };

  const handleShowMore = (event) => {
    event.stopPropagation();
    setShowFullText(!showFullText);
  };

  if (!isObject) {
    const stringValue = String(value);
    const isLongValue = stringValue.length > 100;
    const displayValue = showFullText ? stringValue : truncateText(stringValue);

    return (
      <div className="flex flex-col gap-0.5">
        <div 
          className="flex items-center py-0.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-sm group transition-colors"
          style={{ paddingLeft: `calc(${paddingLeft} + 0.5rem)` }}
        >
          <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
            <span className="font-medium text-xs text-slate-700 dark:text-slate-200 shrink-0">{name}</span>
            <span className="text-slate-400 dark:text-slate-500 shrink-0 text-xs">:</span>
            <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
              <button
                onClick={(e) => handleValueClick(value, e)}
                className={`font-mono text-xs ${getValueStyle(value)} hover:underline cursor-copy text-left ${showFullText ? 'whitespace-pre-wrap break-all' : 'truncate'} min-w-0`}
                title={isLongValue ? stringValue : undefined}
              >
                {displayValue}
              </button>
              {isLongValue && (
                <button
                  onClick={handleShowMore}
                  className="text-[9px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 shrink-0 px-1"
                >
                  {showFullText ? 'Show less' : 'Show more'}
                </button>
              )}
              {isCopied && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded shrink-0">
                  Copied
                </span>
              )}
            </div>
          </div>
        </div>
        {nestedJson && (
          <div className="ml-3 border-l border-slate-200 dark:border-slate-700">
            <TreeNode name="Nested JSON" value={nestedJson} depth={depth + 1} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex items-center py-0.5 px-2 w-full hover:bg-slate-50 dark:hover:bg-slate-800 rounded-sm transition-colors group"
        style={{ paddingLeft: `calc(${paddingLeft} + 0.5rem)` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center flex-1">
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-500 dark:text-slate-400" />
          )}
          <span className="ml-1 font-medium text-xs text-slate-700 dark:text-slate-200">{name}</span>
          <span className="text-slate-400 dark:text-slate-500 ml-1.5 text-xs">
            {Array.isArray(value) ? (
              `Array[${value.length}]`
            ) : (
              `Object{${Object.keys(value).length}}`
            )}
          </span>
        </div>
        <button
          onClick={(e) => handleCopy(value, e)}
          className="opacity-0 group-hover:opacity-100 ml-2"
        >
          <Copy className="h-3 w-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300" />
        </button>
      </button>
      {isExpanded && (
        <div className="border-l border-slate-200 dark:border-slate-700 ml-2">
          {Object.entries(value).map(([key, val]) => (
            <TreeNode
              key={key}
              name={key}
              value={val}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function JsonViewer() {
  const [inputJson, setInputJson] = useState('');
  const [parsedJson, setParsedJson] = useState(null);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [isLoading, setIsLoading] = useState(false);

  const loadFromUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      try {
        // Verify if it's valid JSON before setting
        JSON.parse(text);
        setInputJson(text);
        if (activeTab === 'viewer') {
          processJson(text);
        }
      } catch (parseError) {
        setError('URL did not return valid JSON data');
      }
    } catch (err) {
      setError('Failed to load JSON from URL. Make sure the URL is accessible and returns valid JSON.');
      console.error('Error loading from URL:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setParsedJson(parsed);
      setError('');
      return true;
    } catch (err) {
      setError('Invalid JSON format');
      setParsedJson(null);
      return false;
    }
  };

  const handleTabChange = (value) => {
    if (value === 'viewer') {
      processJson(inputJson);
    }
    setActiveTab(value);
  };

  const beautifyJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const uglifyJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setError('');
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputJson(text);
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  const handleClear = () => {
    setInputJson('');
    setParsedJson(null);
    setError('');
    setUrl('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex gap-2 items-center mb-4">
        <Input
          type="text"
          placeholder="Enter URL to load JSON"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow"
          disabled={isLoading}
        />
        <Button 
          onClick={loadFromUrl} 
          variant="outline" 
          size="icon" 
          title="Load from URL"
          disabled={isLoading}
        >
          <Link className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
        </Button>
      </div>

            <Card className="p-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="viewer">Viewer</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              {activeTab === 'editor' && (
                <>
                  <Button onClick={beautifyJson} variant="outline" size="icon" title="Beautify JSON">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={uglifyJson} variant="outline" size="icon" title="Uglify JSON">
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={handlePaste} variant="outline" size="icon" title="Paste">
                    <FileCode className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleClear} variant="outline" size="icon" title="Clear">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <TabsContent value="editor">
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className="w-full h-96 p-2 font-mono text-xs border rounded-md"
              placeholder="Paste your JSON here..."
            />
          </TabsContent>

          <TabsContent value="viewer">
            <div className="w-full h-96 rounded-md overflow-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {parsedJson && (
                <div className="p-2">
                  <TreeNode name="root" value={parsedJson} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
