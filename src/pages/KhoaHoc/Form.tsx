import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, message, Space } from 'antd';
import { useHistory, useLocation } from 'umi';
import { Course, CourseStatus, instructors } from '@/models/course';
import { addCourse, updateCourse, getCourseById, isCourseNameUnique } from '@/services/courseService';
import TinyEditor from '@/components/TinyEditor';

const { Option } = Select;
// const { TextArea } = Input;

const KhoaHocForm: React.FC = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const id = query.get('id');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const course = getCourseById(id);
      if (course) {
        form.setFieldsValue({
          ...course,
          description: course.description.replace(/&nbsp;/g, ' ').trim()
        });
      }
    }
  }, [id, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (id) {
        // Edit
        if (!isCourseNameUnique(values.name, id)) {
          message.error('Tên khóa học đã tồn tại!');
          return;
        }
        if (updateCourse(id, values)) {
          message.success('Cập nhật khóa học thành công!');
          history.goBack();
        } else {
          message.error('Cập nhật khóa học thất bại!');
        }
      } else {
        // Add
        if (!isCourseNameUnique(values.name)) {
          message.error('Tên khóa học đã tồn tại!');
          return;
        }
        addCourse(values);
        message.success('Thêm khóa học thành công!');
        history.goBack();
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const validateName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Tên khóa học không được để trống!');
    }
    if (value.length > 100) {
      return Promise.reject('Tên khóa học không được vượt quá 100 ký tự!');
    }
    return Promise.resolve();
  };

  return (
    <div>
      <h1>{id ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          studentCount: 0,
          status: 'open',
        }}
      >
        <Form.Item
          label="Tên khóa học"
          name="name"
          rules={[{ validator: validateName }]}
        >
          <Input maxLength={100} showCount />
        </Form.Item>

        <Form.Item
          label="Giảng viên"
          name="instructor"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {instructors.map(inst => (
              <Option key={inst} value={inst}>{inst}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Số lượng học viên"
          name="studentCount"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

<Form.Item
          label="Mô tả khóa học"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
        >
          <TinyEditor height={300} />
        </Form.Item>

        <Form.Item
          label="Trạng thái khóa học"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            {Object.entries(CourseStatus).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {id ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={() => history.goBack()}>
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default KhoaHocForm;