import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div className="md:col-span-1 lg:col-span-1 space-y-6">
       
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-24" /></CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>

         
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

       
        <div className="md:col-span-2 lg:col-span-3">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}