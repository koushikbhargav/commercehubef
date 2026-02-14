'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Table,
  Keyboard,
  Search,
  Check,
  Rocket,
  Loader2,
  FileText,
  Zap
} from 'lucide-react';
import { useStore, Product, ApiConfig } from '@/app/lib/store';

type Step = 'source' | 'sheets' | 'csv' | 'manual' | 'map' | 'deploying' | 'success' | 'api';

type UploadedData = {
  headers: string[];
  rows: any[];
  fileName: string;
};

type FieldMappingType = {
  [key: string]: string; // MCP Field -> User Column Name
};

const MCP_FIELDS = [
  { id: 'name', label: 'Item Name', required: true, keywords: ['name', 'dish', 'product', 'item'] },
  { id: 'price', label: 'Price', required: true, keywords: ['price', 'cost', 'rate', 'amt', 'amount'] },
  { id: 'sku', label: 'SKU / ID', required: false, keywords: ['sku', 'id', 'code'] },
  { id: 'description', label: 'Description', required: false, keywords: ['desc', 'info', 'detail'] },
  { id: 'category', label: 'Category', required: false, keywords: ['cat', 'type', 'group'] },
  { id: 'stock', label: 'Stock / Qty', required: false, keywords: ['stock', 'qty', 'quantity', 'count'] },
];

function ImportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('source');
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [mappings, setMappings] = useState<FieldMappingType>({});

  useEffect(() => {
    const source = searchParams.get('source');
    if (source === 'sheets') setStep('sheets');
    else if (source === 'csv') setStep('csv');
    else if (source === 'manual') setStep('manual');
    else if (source === 'api') setStep('api');
  }, [searchParams]);

  const autoMap = (headers: string[]) => {
    const newMappings: FieldMappingType = {};
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase();
      const match = MCP_FIELDS.find(field =>
        field.keywords.some(keyword => lowerHeader.includes(keyword))
      );
      if (match && !newMappings[match.id]) {
        newMappings[match.id] = header;
      }
    });
    setMappings(newMappings);
  };

  const renderStep = () => {
    switch (step) {
      case 'source': return <SourceSelection onNext={setStep} />;
      case 'sheets': return (
        <GoogleSheetsSource
          onBack={() => setStep('source')}
          onNext={(data: UploadedData) => {
            setUploadedData(data);
            autoMap(data.headers);
            setStep('map');
          }}
        />
      );
      case 'api': return (
        <CustomAPISource
          onBack={() => setStep('source')}
          onNext={(data: UploadedData) => {
            setUploadedData(data);
            autoMap(data.headers);
            setStep('map');
          }}
        />
      );
      case 'csv': return (
        <CSVUploadSource
          onBack={() => setStep('source')}
          onNext={(data: UploadedData) => {
            setUploadedData(data);
            autoMap(data.headers);
            setStep('map');
          }}
        />
      );
      case 'manual': return (
        <ManualEntrySource
          onBack={() => setStep('source')}
          onNext={(data: UploadedData) => {
            setUploadedData(data);
            // Pre-map for manual entry since keys match
            setMappings({
              name: 'name',
              price: 'price',
              category: 'category',
              stock: 'stock'
            });
            setStep('map');
          }}
        />
      );
      case 'map': return (
        <FieldMapping
          data={uploadedData}
          mappings={mappings}
          setMappings={setMappings}
          onBack={() => setStep('source')}
          onNext={() => setStep('deploying')}
        />
      );
      case 'deploying': return <DeployingSequence itemCount={uploadedData?.rows.length || 0} onFinish={() => router.push('/demo/success/import')} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 pb-20 px-4">
      {step !== 'deploying' && step !== 'success' && (
        <button
          onClick={() => router.push('/demo/onboarding?step=5')}
          className="flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to connection selection
        </button>
      )}
      {renderStep()}
    </div>
  );
}

export default function ImportFlow() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-forest-contrast">Loading import tools...</div>}>
      <ImportContent />
    </Suspense>
  );
}

function SourceSelection({ onNext }: { onNext: (step: Step) => void }) {
  const sources = [
    { id: 'sheets', title: 'Cloud Link', desc: 'Secure connection to external Google Cloud sheet repositories.', icon: FileSpreadsheet, recommend: true },
    { id: 'api', title: 'API Protocol', desc: 'Enterprise-grade bidirectional sync with custom REST endpoints.', icon: Zap },
    { id: 'csv', title: 'Local Archive', desc: 'Initialize vault from standardized local CSV/XLSM datasets.', icon: Upload },
    { id: 'manual', title: 'Direct Input', desc: 'Manual entity registration for granular repository control.', icon: Keyboard },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="mb-20">
        <span className="text-[10px] font-bold text-agentic-lime uppercase tracking-[0.5em] mb-4 block">Initialization Protocol</span>
        <h1 className="text-7xl font-display uppercase tracking-tighter text-deep-jungle mb-4">Select Repository</h1>
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-forest-contrast/40">Define the source of truth for your commerce intelligence.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sources.map((src) => (
          <button
            key={src.id}
            onClick={() => onNext(src.id as Step)}
            className="flex items-start p-10 bg-white border border-forest-contrast/10 hover:border-agentic-lime hover:shadow-[0_0_30px_rgba(234,255,148,0.15)] transition-all text-left group relative overflow-hidden"
          >
            <div className="absolute inset-0 dither-mesh opacity-[0.02] pointer-events-none"></div>
            {src.recommend && (
              <div className="absolute top-0 right-0 bg-agentic-lime text-cyber-cream text-[9px] font-bold px-4 py-1.5 uppercase tracking-widest">
                RECOMMENDED
              </div>
            )}
            <div className="w-16 h-16 bg-deep-jungle text-cyber-cream flex items-center justify-center mb-8 shrink-0 mr-8 group-hover:scale-105 transition-transform">
              <src.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-display uppercase tracking-tight text-deep-jungle mb-3">{src.title}</h3>
              <p className="text-[11px] text-forest-contrast/60 leading-relaxed font-medium mb-6">{src.desc}</p>
              <div className="text-agentic-lime font-bold text-[9px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
                ESTABLISH LINK →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CustomAPISource({ onBack, onNext }: { onBack: () => void, onNext: (data: UploadedData) => void }) {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [writeEnabled, setWriteEnabled] = useState(false);
  const [writeMethod, setWriteMethod] = useState<'POST' | 'PUT' | 'PATCH'>('POST');
  const [writeUrl, setWriteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setApiConfig } = useStore();

  const handleConnect = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);

    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch (e) {
          throw new Error('Invalid JSON in headers field.');
        }
      }

      const response = await fetch(url, { headers: parsedHeaders });
      if (!response.ok) {
        throw new Error(`Failed to fetch from API (Status: ${response.status})`);
      }

      const rawData = await response.json();
      let items = Array.isArray(rawData) ? rawData : (rawData.items || rawData.products || rawData.data || []);

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('API returned no data or an unexpected format. Please ensure it returns an array of items.');
      }

      setApiConfig({
        url,
        headers: parsedHeaders,
        interval: 30000,
        enabled: true,
        lastSync: new Date().toISOString(),
        writeEnabled,
        writeMethod,
        writeUrl: writeUrl.trim() || undefined
      });

      const firstItem = items[0];
      const columnHeaders = Object.keys(firstItem);

      onNext({
        headers: columnHeaders,
        rows: items,
        fileName: 'Custom API'
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to the API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="bg-white border border-forest-contrast/10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 dither-mesh opacity-[0.02] pointer-events-none"></div>
        <div className="px-12 py-12 relative z-10">
          <div className="w-16 h-16 bg-deep-jungle text-cyber-cream flex items-center justify-center mb-8">
            <Zap className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-display uppercase tracking-tight text-deep-jungle mb-4">API Protocol</h2>
          <p className="text-[11px] font-medium text-forest-contrast/50 mb-12 leading-relaxed">
            Initialize real-time synchronization. Provide endpoint URL and secured authorization headers.
          </p>

          <div className="space-y-8">
            <div>
              <label className="block text-[9px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-3">Endpoint Identity</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="HTTPS://API.DOMAIN.COM/V1/REPOSITORY"
                className="halofy-input uppercase tracking-widest text-[10px]"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-3">Authorization Tokens (JSON)</label>
              <textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{ "Authorization": "Bearer protocol_key_..." }'
                className="halofy-input font-mono text-xs h-32"
              />
            </div>

            <div className="pt-8 border-t border-forest-contrast/5">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${writeEnabled ? 'bg-agentic-lime border-agentic-lime' : 'border-forest-contrast/20 bg-transparent'}`}>
                  {writeEnabled && <Check className="w-3 h-3 text-cyber-cream" />}
                  <input
                    type="checkbox"
                    checked={writeEnabled}
                    onChange={(e) => setWriteEnabled(e.target.checked)}
                    className="hidden"
                  />
                </div>
                <span className="text-[10px] font-bold text-deep-jungle uppercase tracking-[0.3em] group-hover:text-agentic-lime transition-all">
                  BIDIRECTIONAL INTEROPERABILITY
                </span>
              </label>
            </div>

            {writeEnabled && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <label className="block text-[8px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-3">Method</label>
                    <select
                      value={writeMethod}
                      onChange={(e) => setWriteMethod(e.target.value as any)}
                      className="halofy-input !py-3.5 text-[10px] font-bold"
                    >
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[8px] font-bold text-forest-contrast/30 uppercase tracking-[0.4em] mb-3">Write Sink (Optional)</label>
                    <input
                      type="text"
                      value={writeUrl}
                      onChange={(e) => setWriteUrl(e.target.value)}
                      placeholder="Inherit read identity"
                      className="halofy-input uppercase tracking-widest text-[10px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/5 p-4 border border-red-500/10">{error}</p>}

            <button
              onClick={handleConnect}
              disabled={isLoading || !url}
              className="w-full btn-primary !py-5 flex items-center justify-center gap-4 disabled:opacity-20"
            >
              {isLoading ? 'ESTABLISHING LINKAGE...' : 'VALIDATE & INITIALIZE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleSheetsSource({ onBack, onNext }: { onBack: () => void, onNext: (data: UploadedData) => void }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!url) return;
    setIsLoading(true);
    setError(null);

    try {
      // Extract spreadsheet ID
      const sheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        throw new Error('Invalid Google Sheets URL. Please make sure it follows the format: https://docs.google.com/spreadsheets/d/...');
      }

      const spreadsheetId = sheetIdMatch[1];
      // Use the CSV export URL for the first sheet
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch spreadsheet (Status: ${response.status}). Make sure it is set to "Anyone with link can view".`);
      }

      const text = await response.text();
      // Check if the response is actually an HTML page (like a login page)
      if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
        throw new Error('Received HTML instead of CSV. Please check if the spreadsheet is public.');
      }
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

      if (lines.length > 0) {
        const parseLine = (line: string) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseLine(lines[0]);
        const rows = lines.slice(1).map(line => {
          const values = parseLine(line);
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || '';
          });
          return obj;
        });

        onNext({
          headers,
          rows,
          fileName: 'Google Sheet'
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while connecting to Google Sheets.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
        <div className="w-16 h-16 bg-deep-jungle text-cyber-cream flex items-center justify-center mb-8">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Connect Your Google Sheet</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          The easiest way to keep your inventory synced for AI agents. Make sure your sheet is set to "Anyone with link can view".
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Spreadsheet URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
            />
            {error && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{error}</p>}
          </div>
          <button
            onClick={handleConnect}
            disabled={isLoading || !url}
            className="w-full btn-primary !py-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Connecting...</> : <>{'Continue to mapping'} <CheckCircle2 className="w-5 h-5" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CSVUploadSource({ onBack, onNext }: { onBack: () => void, onNext: (data: UploadedData) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');

      if (lines.length > 0) {
        // Simple CSV parser that handles quotes and commas
        const parseLine = (line: string) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const headers = parseLine(lines[0]);
        const rows = lines.slice(1).map(line => {
          const values = parseLine(line);
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || '';
          });
          return obj;
        });

        onNext({
          headers,
          rows,
          fileName: file.name
        });
      }
      setIsParsing(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
        <div className="w-16 h-16 bg-deep-jungle text-cyber-cream flex items-center justify-center mb-8">
          <Upload className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Upload Your Inventory File</h2>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group mb-8 ${file ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110 ${file ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-indigo-600'}`}>
            {file ? <FileText className="w-8 h-8" /> : <Table className="w-8 h-8" />}
          </div>
          {file ? (
            <div>
              <p className="font-bold text-slate-900 mb-1">{file.name}</p>
              <p className="text-xs text-indigo-600 font-bold">File selected - Click below to continue</p>
            </div>
          ) : (
            <>
              <p className="font-bold text-slate-900 mb-1">Click to select your file</p>
              <p className="text-xs text-slate-500">Supports CSV files up to 10MB</p>
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isParsing}
          className="w-full btn-primary !py-4 flex items-center justify-center gap-2"
        >
          {isParsing ? <><Loader2 className="w-5 h-5 animate-spin" /> Parsing...</> : 'Upload and Continue'}
        </button>
      </div>
    </div>
  );
}

function ManualEntrySource({ onBack, onNext }: { onBack: () => void, onNext: (data: UploadedData) => void }) {
  const [items, setItems] = useState<any[]>([
    { name: '', category: '', price: '', stock: '' },
    { name: '', category: '', price: '', stock: '' },
    { name: '', category: '', price: '', stock: '' },
  ]);

  const addRow = () => {
    setItems([...items, { name: '', category: '', price: '', stock: '' }]);
  };

  const removeRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    const validItems = items.filter(item => item.name && item.price);
    if (validItems.length === 0) {
      alert('Please add at least one item with a name and price.');
      return;
    }

    onNext({
      headers: ['name', 'category', 'price', 'stock'],
      rows: validItems,
      fileName: 'Manual Entry'
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Your Items Manually</h2>
          <button
            onClick={addRow}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Add Row
          </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-4 border-b border-slate-100">Item Name *</th>
                <th className="px-8 py-4 border-b border-slate-100">Category</th>
                <th className="px-8 py-4 border-b border-slate-100">Price *</th>
                <th className="px-8 py-4 border-b border-slate-100">Stock</th>
                <th className="px-8 py-4 border-b border-slate-100"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(i, 'name', e.target.value)}
                      placeholder="e.g. Butter Chicken"
                      className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:font-normal placeholder:text-slate-300"
                    />
                  </td>
                  <td className="px-8 py-4">
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => updateItem(i, 'category', e.target.value)}
                      placeholder="Main Course"
                      className="w-full bg-transparent border-none outline-none text-sm text-slate-500"
                    />
                  </td>
                  <td className="px-8 py-4">
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => updateItem(i, 'price', e.target.value)}
                      placeholder="450"
                      className="w-full bg-transparent border-none outline-none text-sm font-mono text-indigo-600"
                    />
                  </td>
                  <td className="px-8 py-4">
                    <input
                      type="text"
                      value={item.stock}
                      onChange={(e) => updateItem(i, 'stock', e.target.value)}
                      placeholder="25"
                      className="w-full bg-transparent border-none outline-none text-sm"
                    />
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() => removeRow(i)}
                      className="text-slate-300 hover:text-red-500 transition-colors text-xl leading-none"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="py-12 text-center text-slate-400 italic text-sm">
              No items added. Click "+ Add Row" to begin.
            </div>
          )}
        </div>
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 italic">Fields marked with * are required to sync.</p>
          <button onClick={handleSave} className="btn-primary px-8">Save & Continue</button>
        </div>
      </div>
    </div>
  );
}

function FieldMapping({
  data,
  mappings,
  setMappings,
  onBack,
  onNext
}: {
  data: UploadedData | null,
  mappings: FieldMappingType,
  setMappings: React.Dispatch<React.SetStateAction<FieldMappingType>>,
  onBack: () => void,
  onNext: () => void
}) {
  const { setInventory } = useStore();
  const displayHeaders = data?.headers || [];
  const sampleRow = data?.rows[0] || {};

  const handleGenerate = () => {
    if (data && data.rows.length > 0) {
      // Transform rows to Product format using mappings
      const products: Product[] = data.rows.map((row, i) => ({
        id: row[mappings['sku']] || row['sku'] || row['ID'] || `item-${i}`,
        name: row[mappings['name']] || 'Unnamed Item',
        price: parseFloat(row[mappings['price']]?.toString().replace(/[^0-9.]/g, '') || '0'),
        currency: 'USD',
        category: row[mappings['category']] || 'General',
        stock: parseInt(row[mappings['stock']]?.toString().replace(/[^0-9]/g, '') || '100'),
        description: row[mappings['description']] || ''
      }));

      // If we are coming from a Custom API source, update the apiConfig in the store with these mappings
      const { getActiveStore, setApiConfig } = useStore.getState();
      const store = getActiveStore();
      if (store.apiConfig) {
        setApiConfig({
          ...store.apiConfig,
          mappings: mappings
        });
      }

      setInventory(products, data.fileName === 'Custom API' ? 'Custom API' : undefined);
    }
    onNext();
  };

  const updateMapping = (fieldId: string, headerName: string) => {
    setMappings(prev => ({
      ...prev,
      [fieldId]: headerName
    }));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 block">Step 2 of 3</span>
        <h1 className="text-4xl font-display text-slate-900 mb-4">Map Your Columns</h1>
        <p className="text-slate-500">Tell us what each column represents so we can build your tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-sm text-emerald-800 font-medium">
              We auto-detected {Object.keys(mappings).length} column mappings. Review them below.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-4 border-b border-slate-100">MCP Standard Field</th>
                  <th className="px-8 py-4 border-b border-slate-100">Your Column Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MCP_FIELDS.map((field) => (
                  <tr key={field.id}>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700">{field.label}{field.required && ' *'}</p>
                      <p className="text-xs text-slate-400">System ID: {field.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={mappings[field.id] || 'unmapped'}
                        onChange={(e) => updateMapping(field.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <option value="unmapped">-- Not Mapped --</option>
                        {displayHeaders.map(header => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" /> Auto-Summary
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mapping Result</p>
                <div className="space-y-1">
                  {MCP_FIELDS.filter(f => mappings[f.id]).map(f => (
                    <div key={f.id} className="flex justify-between text-xs">
                      <span className="text-slate-500">{f.label}:</span>
                      <span className="font-bold text-slate-700 truncate ml-2">{mappings[f.id]}</span>
                    </div>
                  ))}
                  {!Object.keys(mappings).length && <p className="text-xs text-slate-400 italic">No fields mapped yet</p>}
                </div>
              </div>
              <p className="text-xs text-slate-400 text-center italic mt-4">+ {data?.rows.length ? data.rows.length : 0} items detected</p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!mappings['name'] || !mappings['price']}
            className="w-full btn-primary !py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate My Server <Rocket className="w-5 h-5" />
          </button>
          {(!mappings['name'] || !mappings['price']) && (
            <p className="text-[10px] text-red-500 font-bold text-center uppercase tracking-wide">
              Name and Price mappings are required
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DeployingSequence({ itemCount, onFinish }: { itemCount: number, onFinish: () => void }) {
  const [stage, setStage] = useState(0);
  const stages = [
    `Analyzing ${itemCount} inventory items...`,
    "Creating MCP search tools...",
    "Building API endpoints...",
    "Deploying to Halo Cloud...",
    "Testing connection... 200 OK!"
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setStage(prev => {
        if (prev === stages.length - 1) {
          clearInterval(timer);
          setTimeout(onFinish, 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [stages.length, onFinish]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
      <div className="relative mb-12">
        <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-200 animate-pulse" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-display text-slate-900">{stages[stage]}</h2>
        <div className="w-64 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${((stage + 1) / stages.length) * 100}%` }}
          />
        </div>
        <div className="flex flex-col gap-2 mt-8">
          {stages.slice(0, stage).map((s, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-emerald-500 text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
              <CheckCircle2 className="w-4 h-4" /> {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
