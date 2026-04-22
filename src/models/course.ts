export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  description: string;
  status: 'open' | 'ended' | 'paused';
}

export const CourseStatus = {
  open: 'Đang mở',
  ended: 'Đã kết thúc',
  paused: 'Tạm dừng',
} as const;

export type CourseStatusType = keyof typeof CourseStatus;

export const instructors = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Phạm Thị D',
  'Hoàng Văn E',
];