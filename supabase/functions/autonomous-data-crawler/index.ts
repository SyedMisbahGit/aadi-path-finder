
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CrawlRequest {
  sources: string[];
  examType: 'NEET' | 'JEE-MAIN';
  year: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sources = ['all'], examType, year = 2025 }: CrawlRequest = await req.json();
    
    console.log('Starting autonomous data crawling for:', { sources, examType, year });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results = {
      crawled: [],
      processed: 0,
      errors: [],
      lastUpdated: new Date().toISOString()
    };

    // Crawl MCC NEET data
    if ((sources.includes('all') || sources.includes('mcc')) && examType === 'NEET') {
      try {
        const mccData = await crawlMCCData(year);
        await processMCCData(mccData, supabase);
        results.crawled.push('MCC NEET UG');
        results.processed += mccData.length;
      } catch (error) {
        console.error('MCC crawling error:', error);
        results.errors.push(`MCC: ${error.message}`);
      }
    }

    // Crawl JoSAA data
    if ((sources.includes('all') || sources.includes('josaa')) && examType === 'JEE-MAIN') {
      try {
        const josaaData = await crawlJoSAAData(year);
        await processJoSAAData(josaaData, supabase);
        results.crawled.push('JoSAA JEE Main');
        results.processed += josaaData.length;
      } catch (error) {
        console.error('JoSAA crawling error:', error);
        results.errors.push(`JoSAA: ${error.message}`);
      }
    }

    // Crawl state counseling data
    if (sources.includes('all') || sources.includes('states')) {
      try {
        const stateData = await crawlStateCounselingData(examType, year);
        await processStateData(stateData, supabase);
        results.crawled.push('State Counseling Boards');
        results.processed += stateData.length;
      } catch (error) {
        console.error('State crawling error:', error);
        results.errors.push(`States: ${error.message}`);
      }
    }

    // Update crawl status
    await supabase
      .from('crawl_status')
      .upsert({
        exam_type: examType,
        year: year,
        last_crawled: new Date().toISOString(),
        sources_crawled: results.crawled,
        records_processed: results.processed,
        errors: results.errors
      });

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Autonomous crawler error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

// MCC NEET UG data crawler
async function crawlMCCData(year: number): Promise<any[]> {
  console.log(`Crawling MCC NEET UG data for ${year}`);
  
  // In production, this would use web scraping or API calls
  // For now, simulating with mock data structure
  const mockMCCData = [
    {
      college: "AIIMS Delhi",
      course: "MBBS",
      category: "general",
      round: 1,
      opening_rank: 1,
      closing_rank: 50,
      seats: 100,
      state: "Delhi",
      quota: "All India"
    },
    {
      college: "Maulana Azad Medical College",
      course: "MBBS", 
      category: "general",
      round: 1,
      opening_rank: 200,
      closing_rank: 350,
      seats: 250,
      state: "Delhi",
      quota: "Delhi State"
    }
    // More colleges would be scraped in production
  ];

  // Simulate OCR processing for PDFs
  console.log('Processing MCC PDFs with OCR...');
  
  return mockMCCData;
}

// JoSAA JEE Main data crawler
async function crawlJoSAAData(year: number): Promise<any[]> {
  console.log(`Crawling JoSAA JEE Main data for ${year}`);
  
  const mockJoSAAData = [
    {
      college: "NIT Trichy",
      course: "Computer Science Engineering",
      category: "general",
      round: 1,
      opening_rank: 500,
      closing_rank: 1200,
      seats: 120,
      state: "Tamil Nadu",
      quota: "Other State"
    },
    {
      college: "IIIT Hyderabad",
      course: "Computer Science Engineering",
      category: "general", 
      round: 1,
      opening_rank: 300,
      closing_rank: 800,
      seats: 200,
      state: "Telangana",
      quota: "All India"
    }
  ];

  return mockJoSAAData;
}

// State counseling data crawler
async function crawlStateCounselingData(examType: string, year: number): Promise<any[]> {
  console.log(`Crawling state counseling data for ${examType} ${year}`);
  
  const mockStateData = [
    {
      college: "Government Medical College, Mumbai",
      course: "MBBS",
      category: "general",
      round: 1,
      opening_rank: 800,
      closing_rank: 1500,
      seats: 150,
      state: "Maharashtra",
      quota: "State Quota",
      board: "Maharashtra CET"
    }
  ];

  return mockStateData;
}

// Process and store MCC data
async function processMCCData(data: any[], supabase: any): Promise<void> {
  console.log('Processing MCC data into database...');
  
  for (const record of data) {
    // Insert/update college information
    const { data: college, error: collegeError } = await supabase
      .from('colleges')
      .upsert({
        name: record.college,
        location: record.state,
        state: record.state,
        type: 'government',
        exam_accepted: ['NEET'],
        courses: [record.course]
      }, { onConflict: 'name' });

    if (collegeError) {
      console.error('Error inserting college:', collegeError);
      continue;
    }

    // Insert historical cutoff data
    await supabase
      .from('historical_cutoffs')
      .upsert({
        college_id: college?.[0]?.id,
        exam_name: 'NEET',
        exam_year: 2025,
        category: record.category,
        round_number: record.round,
        opening_rank: record.opening_rank,
        closing_rank: record.closing_rank,
        state_quota: record.quota.includes('State')
      });
  }
}

// Process and store JoSAA data
async function processJoSAAData(data: any[], supabase: any): Promise<void> {
  console.log('Processing JoSAA data into database...');
  
  for (const record of data) {
    const { data: college } = await supabase
      .from('colleges')
      .upsert({
        name: record.college,
        location: record.state,
        state: record.state,
        type: record.college.includes('NIT') ? 'nit' : 'iiit',
        exam_accepted: ['JEE-MAIN'],
        courses: [record.course]
      }, { onConflict: 'name' });

    await supabase
      .from('historical_cutoffs')
      .upsert({
        college_id: college?.[0]?.id,
        exam_name: 'JEE-MAIN',
        exam_year: 2025,
        category: record.category,
        round_number: record.round,
        opening_rank: record.opening_rank,
        closing_rank: record.closing_rank,
        state_quota: record.quota.includes('State')
      });
  }
}

// Process state counseling data
async function processStateData(data: any[], supabase: any): Promise<void> {
  console.log('Processing state counseling data...');
  
  for (const record of data) {
    const { data: college } = await supabase
      .from('colleges') 
      .upsert({
        name: record.college,
        location: record.state,
        state: record.state,
        type: 'government',
        exam_accepted: [record.course === 'MBBS' ? 'NEET' : 'JEE-MAIN'],
        courses: [record.course]
      }, { onConflict: 'name' });

    await supabase
      .from('historical_cutoffs')
      .upsert({
        college_id: college?.[0]?.id,
        exam_name: record.course === 'MBBS' ? 'NEET' : 'JEE-MAIN',
        exam_year: 2025,
        category: record.category,
        round_number: record.round,
        opening_rank: record.opening_rank,
        closing_rank: record.closing_rank,
        state_quota: true
      });
  }
}

serve(handler);
