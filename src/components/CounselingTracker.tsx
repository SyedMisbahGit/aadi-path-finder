
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, TrendingDown, Clock } from "lucide-react";

interface CounselingRound {
  round: number;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  resultDate: string;
}

interface RankMovement {
  college: string;
  branch: string;
  category: string;
  currentRank: number;
  previousRank: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export const CounselingTracker = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedExam, setSelectedExam] = useState<'josaa' | 'neet-aiq' | 'state'>('josaa');

  // Mock data - in production, this would fetch from live APIs
  const { data: counselingRounds, isLoading: roundsLoading } = useQuery({
    queryKey: ['counseling-rounds', selectedExam],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRounds: CounselingRound[] = [
        {
          round: 1,
          status: 'completed',
          startDate: '2025-06-15',
          endDate: '2025-06-22',
          resultDate: '2025-06-25'
        },
        {
          round: 2,
          status: 'active',
          startDate: '2025-06-26',
          endDate: '2025-07-03',
          resultDate: '2025-07-06'
        },
        {
          round: 3,
          status: 'upcoming',
          startDate: '2025-07-10',
          endDate: '2025-07-17',
          resultDate: '2025-07-20'
        }
      ];
      
      return mockRounds;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: rankMovements, isLoading: movementsLoading } = useQuery({
    queryKey: ['rank-movements', selectedExam],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockMovements: RankMovement[] = [
        {
          college: 'IIT Delhi',
          branch: 'Computer Science',
          category: 'General',
          currentRank: 150,
          previousRank: 145,
          change: 5,
          trend: 'down'
        },
        {
          college: 'IIT Bombay',
          branch: 'Electrical Engineering',
          category: 'OBC',
          currentRank: 890,
          previousRank: 920,
          change: -30,
          trend: 'up'
        },
        {
          college: 'NIT Trichy',
          branch: 'Mechanical Engineering',
          category: 'SC',
          currentRank: 2500,
          previousRank: 2500,
          change: 0,
          trend: 'stable'
        }
      ];
      
      return mockMovements;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const refreshData = () => {
    setLastUpdated(new Date());
    // Force refetch of all queries
    window.location.reload();
  };

  const getStatusColor = (status: CounselingRound['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: RankMovement['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🔁 Real-Time Counseling Tracker</h2>
          <p className="text-gray-600">Live updates from 2025 counseling rounds</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={selectedExam} onValueChange={(value) => setSelectedExam(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="josaa">JoSAA</TabsTrigger>
          <TabsTrigger value="neet-aiq">NEET AIQ</TabsTrigger>
          <TabsTrigger value="state">State Quotas</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedExam} className="space-y-6">
          {/* Counseling Rounds Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Counseling Rounds - {selectedExam.toUpperCase()}</CardTitle>
              <CardDescription>Track the progress of each counseling round</CardDescription>
            </CardHeader>
            <CardContent>
              {roundsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {counselingRounds?.map((round) => (
                    <div key={round.round} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(round.status)}`} />
                        <div>
                          <h4 className="font-semibold">Round {round.round}</h4>
                          <p className="text-sm text-gray-600">
                            {round.startDate} - {round.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={round.status === 'active' ? 'default' : 'secondary'}>
                          {round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          Result: {round.resultDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rank Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Live Rank Movements</CardTitle>
              <CardDescription>Track closing rank changes across rounds</CardDescription>
            </CardHeader>
            <CardContent>
              {movementsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {rankMovements?.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{movement.college}</h4>
                        <p className="text-sm text-gray-600">{movement.branch} - {movement.category}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{movement.currentRank}</p>
                          <p className="text-xs text-gray-500">Current Rank</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(movement.trend)}
                          <span className={`text-sm font-medium ${
                            movement.change > 0 ? 'text-red-600' : 
                            movement.change < 0 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {movement.change > 0 ? '+' : ''}{movement.change}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
