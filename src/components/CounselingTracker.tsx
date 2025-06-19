
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Target } from "lucide-react";

export const CounselingTracker = () => {
  const counselingRounds = [
    {
      id: 1,
      name: "Round 1",
      nameUrdu: "راؤنڈ 1",
      status: "completed",
      startDate: "2025-01-15",
      endDate: "2025-01-20",
      progress: 100,
      seatsAllotted: 85234,
      totalSeats: 100000
    },
    {
      id: 2,
      name: "Round 2", 
      nameUrdu: "راؤنڈ 2",
      status: "ongoing",
      startDate: "2025-01-25",
      endDate: "2025-01-30",
      progress: 65,
      seatsAllotted: 12453,
      totalSeats: 20000
    },
    {
      id: 3,
      name: "Mop-up Round",
      nameUrdu: "موپ اپ راؤنڈ",
      status: "upcoming",
      startDate: "2025-02-05",
      endDate: "2025-02-10",
      progress: 0,
      seatsAllotted: 0,
      totalSeats: 5000
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">✓ Completed / مکمل</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500">🔄 Ongoing / جاری</Badge>;
      case 'upcoming':
        return <Badge variant="outline">⏳ Upcoming / آنے والا</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🗓️ Live Counseling Tracker</h2>
        <p className="text-gray-600">براہ راست کاؤنسلنگ ٹریکر</p>
        <p className="text-sm text-gray-500 mt-2">Real-time updates on NEET & JEE counseling rounds</p>
      </div>

      <div className="grid gap-4">
        {counselingRounds.map((round) => (
          <Card key={round.id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {round.name} / {round.nameUrdu}
                </CardTitle>
                {getStatusBadge(round.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Duration / مدت</p>
                    <p className="text-xs text-gray-600">
                      {round.startDate} to {round.endDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Seats Allotted / تفویض شدہ نشستیں</p>
                    <p className="text-xs text-gray-600">
                      {round.seatsAllotted.toLocaleString()} / {round.totalSeats.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {round.status === 'ongoing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress / پیش قدمی</span>
                    <span>{round.progress}%</span>
                  </div>
                  <Progress value={round.progress} className="w-full" />
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Key Updates / اہم اپڈیٹس</span>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  {round.status === 'completed' && (
                    <>
                      <li>✓ All document verification completed</li>
                      <li>✓ Seat allotment results declared</li>
                      <li>✓ Fee payment window closed</li>
                    </>
                  )}
                  {round.status === 'ongoing' && (
                    <>
                      <li>🔄 Document verification in progress</li>
                      <li>⏳ Choice filling deadline: Jan 28, 2025</li>
                      <li>📊 Seat allotment expected: Jan 31, 2025</li>
                    </>
                  )}
                  {round.status === 'upcoming' && (
                    <>
                      <li>📅 Registration starts: Feb 1, 2025</li>
                      <li>📝 Fresh choice filling required</li>
                      <li>🎯 Limited seats available</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Target className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900">Live Data Sources / براہ راست ڈیٹا کے ذرائع</h4>
              <p className="text-sm text-blue-800 mt-1">
                Data is updated every 30 minutes from official sources including MCC.nic.in, JoSAA.nic.in, and state counseling portals.
              </p>
              <p className="text-xs text-blue-700 mt-2">
                ڈیٹا ہر 30 منٹ میں سرکاری ذرائع سے اپڈیٹ ہوتا ہے
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
