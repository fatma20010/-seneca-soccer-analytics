import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Wifi } from 'lucide-react';

const TestConnection = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResults(null);

    const tests = [
      {
        name: 'API Health Check',
        test: async () => {
          const response = await fetch('http://localhost:5000/api/health');
          return response.json();
        }
      },
      {
        name: 'API Status Check', 
        test: async () => {
          const response = await fetch('http://localhost:5000/api/status');
          return response.json();
        }
      }
    ];

    const testResults = [];

    for (const test of tests) {
      try {
        const result = await test.test();
        testResults.push({
          name: test.name,
          success: true,
          data: result
        });
      } catch (error) {
        testResults.push({
          name: test.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    setResults(testResults);
    setTesting(false);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5" />
          Soccer Analytics API Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            'Test API Connection'
          )}
        </Button>

        {results && (
          <div className="space-y-3">
            <h4 className="font-semibold">Test Results:</h4>
            {results.map((result: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface border">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{result.name}</span>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? 'PASS' : 'FAIL'}
                    </Badge>
                  </div>
                  {result.success && result.data && (
                    <pre className="text-xs text-muted-foreground bg-background p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                  {!result.success && (
                    <p className="text-sm text-red-400">{result.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Expected:</strong> API server running on http://localhost:5000</p>
          <p><strong>Start server:</strong> <code>cd soccer-analytics-pipeline && python simple_web_app.py</code></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestConnection;
