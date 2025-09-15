import { Skeleton } from "@/components/ui/skeleton";

export default function RoomPageSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <Skeleton className="h-6 w-40" />
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        
        <div className="flex items-end gap-2 justify-start">
          <Skeleton className="w-48 h-12 rounded-lg" />
        </div>
        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="w-56 h-16 rounded-lg" />
        </div>
        <div className="flex items-end gap-2 justify-start">
          <Skeleton className="w-32 h-8 rounded-lg" />
        </div>
        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="w-64 h-12 rounded-lg" />
        </div>
      </main>

      <footer className="p-4 bg-white dark:bg-gray-800 border-t">
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </footer>
    </div>
  );
}