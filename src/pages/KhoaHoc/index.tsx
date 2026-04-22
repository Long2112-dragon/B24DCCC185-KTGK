import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'umi';
import { Course, CourseStatus, instructors } from '@/models/course';
import { getCourses, deleteCourse } from '@/services/courseService';

const { Option } = Select;
const { Search } = Input;

const KhoaHoc: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState('');
  const [instructorFilter, setInstructorFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const history = useHistory();

  useEffect(() => {
    // Reload courses whenever the page is focused
    const handleFocus = () => {
      loadCourses();
    };
    window.addEventListener('focus', handleFocus);
    loadCourses();
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [refreshKey]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchText, instructorFilter, statusFilter]);

  const loadCourses = () => {
    const data = getCourses();
    setCourses(data);
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchText) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()));
    }

    if (instructorFilter) {
      filtered = filtered.filter(c => c.instructor === instructorFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCourses(filtered);
  };

  const handleDelete = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (course && course.studentCount > 0) {
      message.error('Không thể xóa khóa học đã có học viên!');
      return;
    }
    if (deleteCourse(id)) {
      message.success('Xóa khóa học thành công!');
      setRefreshKey(prev => prev + 1);
    } else {
      message.error('Xóa khóa học thất bại!');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Số lượng học viên',
      defaultSortOrder: 'descend' as any,
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => CourseStatus[status as keyof typeof CourseStatus],
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => history.push(`/khoa-hoc/form?id=${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa khóa học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>Quản lý khóa học</h1>
        <Space wrap style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Search
            placeholder="Tìm kiếm theo tên khóa học"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo giảng viên"
            allowClear
            onChange={setInstructorFilter}
            style={{ width: 150 }}
          >
            {instructors.map(inst => (
              <Option key={inst} value={inst}>{inst}</Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            {Object.entries(CourseStatus).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/khoa-hoc/form')}
            size="middle"
          >
            Thêm mới
          </Button>
        </Space>
      </div>
      <div style={{ background: '#fff', padding: '16px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          pagination={{ pageSize: 10, total: filteredCourses.length }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default KhoaHoc;