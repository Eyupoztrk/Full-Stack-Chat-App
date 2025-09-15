import { formatDateSeparator } from '@/lib/dateUtils';

interface DateSeparatorProps {
  date: string;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-gray-100 dark:bg-gray-900 px-2 text-sm text-gray-500">
          {formatDateSeparator(date)}
        </span>
      </div>
    </div>
  );
}