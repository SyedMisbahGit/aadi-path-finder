
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Bell, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'application' | 'counseling' | 'document' | 'fee' | 'other';
  status: 'upcoming' | 'active' | 'completed' | 'missed';
  institute: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export const AdmissionTimeline = () => {
  const [selectedInstitute, setSelectedInstitute] = useState<string>('all');
  
  const { data: timelineEvents, isLoading } = useQuery({
    queryKey: ['admission-timeline', selectedInstitute],
    queryFn: async () => {
      // Mock API call - in production, this would fetch real data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvents: TimelineEvent[] = [
        {
          id: '1',
          title: 'JoSAA Round 1 Registration',
          date: '2025-06-15',
          endDate: '2025-06-22',
          type: 'counseling',
          status: 'completed',
          institute: 'JoSAA',
          description: 'Choice filling for JEE Main/Advanced counseling',
          priority: 'high'
        },
        {
          id: '2',
          title: 'NEET AIQ Round 1 Choice Filling',
          date: '2025-06-20',
          endDate: '2025-06-25',
          type: 'counseling',
          status: 'active',
          institute: 'MCC',
          description: 'Submit your college preferences for NEET AIQ',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Document Verification - AIIMS',
          date: '2025-07-01',
          endDate: '2025-07-05',
          type: 'document',
          status: 'upcoming',
          institute: 'AIIMS',
          description: 'Physical document verification for selected candidates',
          priority: 'high'
        },
        {
          id: '4',
          title: 'Fee Payment Deadline - IIT Delhi',
          date: '2025-07-10',
          type: 'fee',
          status: 'upcoming',
          institute: 'IIT Delhi',
          description: 'Pay admission fees to confirm seat',
          priority: 'high'
        },
        {
          id: '5',
          title: 'Semester Classes Begin',
          date: '2025-08-01',
          type: 'other',
          status: 'upcoming',
          institute: 'Various',
          description: 'Academic session 2025-26 begins',
          priority: 'medium'
        }
      ];
      
      return selectedInstitute === 'all' 
        ? mockEvents 
        : mockEvents.filter(event => event.institute.toLowerCase().includes(selectedInstitute.toLowerCase()));
    }
  });

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'missed': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getTypeIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'application': return <Clock className="w-4 h-4" />;
      case 'counseling': return <Calendar className="w-4 h-4" />;
      case 'document': return <AlertTriangle className="w-4 h-4" />;
      case 'fee': return <Bell className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: TimelineEvent['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const setReminder = (event: TimelineEvent) => {
    // In a real app, this would set up browser notifications or email reminders
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success(`Reminder set for ${event.title}`);
          // You could schedule a notification here
        } else {
          toast.info("Reminder saved locally (notifications disabled)");
        }
      });
    } else {
      toast.info("Reminder saved locally");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const institutes = ['all', 'JoSAA', 'MCC', 'AIIMS', 'IIT Delhi', 'Various'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🗓️ Admission Timeline</h2>
          <p className="text-gray-600">Track important dates and deadlines</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {institutes.map(institute => (
              <option key={institute} value={institute}>
                {institute === 'all' ? 'All Institutes' : institute}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4,].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {timelineEvents?.map((event) => {
              const daysUntil = getDaysUntil(event.date);
              
              return (
                <Card key={event.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              {getTypeIcon(event.type)}
                              {event.institute}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.date)}
                              {event.endDate && ` - ${formatDate(event.endDate)}`}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(event.priority)}>
                          {event.priority}
                        </Badge>
                        {event.status === 'upcoming' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setReminder(event)}
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            Remind
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    
                    {event.status === 'upcoming' && daysUntil >= 0 && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⏳ {daysUntil === 0 ? 'Today!' : 
                               daysUntil === 1 ? 'Tomorrow' : 
                               `${daysUntil} days remaining`}
                        </p>
                      </div>
                    )}
                    
                    {event.status === 'active' && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          🟢 Currently active - Action required!
                        </p>
                      </div>
                    )}
                    
                    {event.status === 'missed' && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-800">
                          ❌ Deadline missed - Check for extended dates
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
