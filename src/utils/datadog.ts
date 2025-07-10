import fetch from 'node-fetch';

const DATADOG_API_KEY = process.env.DD_API_KEY;
const DATADOG_SITE = process.env.DD_SITE || 'datadoghq.com';

interface DatadogLog {
  message: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  ddsource: string;
  ddtags: string;
  timestamp?: number;
  hostname?: string;
  [key: string]: any;
}

export async function sendToDatadogAPI(logData: DatadogLog) {
  if (!DATADOG_API_KEY) {
    console.warn('DD_API_KEY not set, skipping Datadog API call');
    return;
  }

  try {
    const response = await fetch(`https://http-intake.logs.${DATADOG_SITE}/api/v2/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': DATADOG_API_KEY,
        'DD-SOURCE': 'nodejs'
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      console.error('Failed to send to Datadog:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending to Datadog:', error);
  }
}

export function createDatadogLog(
  message: string,
  level: 'info' | 'warn' | 'error',
  additionalData: Record<string, any> = {}
): DatadogLog {
  return {
    message,
    level,
    service: 'llmc-api',
    ddsource: 'nodejs',
    ddtags: `env:${process.env.NODE_ENV || 'development'},version:1.0.0`,
    timestamp: Math.floor(Date.now() / 1000),
    hostname: process.env.HOSTNAME || 'unknown',
    ...additionalData
  };
} 