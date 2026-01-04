import React, { useState } from 'react';
import { 
  runLighthouseAudit, 
  formatLighthouseReportAsHtml, 
  LighthouseReport 
} from '../utils/lighthouseChecker';

interface LighthouseScoreCheckerProps {
  initialUrl?: string;
}

const LighthouseScoreChecker: React.FC<LighthouseScoreCheckerProps> = ({ 
  initialUrl = window.location.origin 
}) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [isRunningAudit, setIsRunningAudit] = useState<boolean>(false);
  const [report, setReport] = useState<LighthouseReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAudit = async () => {
    setIsRunningAudit(true);
    setError(null);
    
    try {
      const newReport = await runLighthouseAudit(url);
      setReport(newReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsRunningAudit(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Lighthouse PWA Score Checker</h2>
      
      <div className="mb-6">
        <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
          URL to audit
        </label>
        <div className="flex">
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="https://example.com"
          />
          <button
            onClick={handleRunAudit}
            disabled={isRunningAudit || !url}
            className={`px-4 py-2 rounded-r-md ${
              isRunningAudit || !url
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isRunningAudit ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running...
              </span>
            ) : 'Run Audit'}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter the URL of the page you want to audit. For local development, use your localhost URL.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {report && (
        <div 
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: formatLighthouseReportAsHtml(report) }}
        />
      )}
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">About Lighthouse PWA Score</h3>
        <p className="text-gray-700 mb-4">
          Lighthouse is an open-source, automated tool for improving the quality of web pages. 
          It audits performance, accessibility, progressive web apps, SEO, and more.
        </p>
        <p className="text-gray-700 mb-4">
          The PWA score is based on a checklist that measures your app against the baseline 
          Progressive Web App specification. A high PWA score ensures your app is:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
          <li>Installable on user's device</li>
          <li>Works offline or with poor connectivity</li>
          <li>Loads quickly and is responsive</li>
          <li>Provides a good user experience</li>
        </ul>
        <p className="text-gray-700">
          Note: This is a simulated Lighthouse audit for demonstration purposes. 
          For a full audit, use Chrome DevTools or the Lighthouse CLI.
        </p>
      </div>
    </div>
  );
};

export default LighthouseScoreChecker;
