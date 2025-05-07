import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import JoditEditor from '../components/JoditEditor';
import Label from '../components/Label';
import Select from '../components/Select';
import emptyInputWarning from '../utils/emtyInputWarning';

const H2 = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 12px;
  font-weight: 500;
`;

const FormChild = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: normal;
    gap: 0;
  }
`;

const InlineFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  z-index: 0;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
  justify-content: right;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ButtonMod = styled(Button)`
  width: 100px;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const CourseEditor = ({ form, setForm, mode, setIsView }) => {
  const formRef = useRef();
  const [waitProcess, setWaitProcess] = useState(false); 
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if(mode == 'Create') {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
  }, [mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const statuss = [
    { label: "Công bố", value: "Publish" },
    { label: "Bản nháp", value: "Draft" },
    { label: "Lưu trữ", value: "Archive" },
  ];

  const handleSubmitButton = () => {
    if (formRef.current) {
        formRef.current.requestSubmit();
    }
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedForm = {
      ...form,
      courseName: form.courseName.trim(),
      courseDescription: form.courseDescription.trim(),
      courseCategoryId: form.courseCategoryId,
      courseStartDate: form.courseStartDate,
      courseEndDate: form.courseEndDate,
      courseMaxStudent: form.courseMaxStudent == '' ? 0 : form.courseMaxStudent,
      coursePrice: form.coursePrice == '' ? 0 : form.coursePrice,
      courseStatus: form.courseStatus,
      userId: form.userId,
    };
    if(processedForm.courseStatus == 'Publish') {
      const emptyFields = Object.entries(processedForm)
      .filter(([key, value]) => !value && key != 'courseCategoryId' && key != 'userId' && key != 'userFullName'
      && key != 'totalEnrollments' && key != 'coursePrice' && key != 'courseDescription')
      .map(([key]) => key);
      if (emptyFields.length > 0) {
        console.log(emptyFields);
        
        emptyFields.forEach((field) => {
          emptyInputWarning(field);
        });
        toast.warning('Vui lòng nhập đầy đủ thông tin.', { position: 'top-right', autoClose: 3000 });
        return;
      }
      if (form.courseMaxStudent <= 0) {
        toast.warning('Số lượng học viên phải lớn hơn 0.', { position: 'top-right', autoClose: 3000 });
        emptyInputWarning('courseMaxStudent');
        return;
      }
    }
    if (form.courseName.length <= 0) {
      toast.warning('Vui lòng nhập tên khóa học.', { position: 'top-right', autoClose: 3000 });
      emptyInputWarning('courseName');
      return;
    }
    setWaitProcess(true);
    try {
        let response;
        if (!isUpdate) {
          response = await axios.post('http://localhost:5000/api/course/create-course', processedForm, { withCredentials: true });
          localStorage.setItem('selectedCourse', JSON.stringify(response.data.course));
          setIsUpdate(true);
        } else {
          const storedCourse = localStorage.getItem('selectedCourse');
          if (storedCourse) {
            const selectedCourse = JSON.parse(storedCourse);
            response = await axios.put(`http://localhost:5000/api/course/${selectedCourse.courseId}`, processedForm, { withCredentials: true });
          }
        }
        toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
    } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
        setWaitProcess(false);
    }
  }

  return (
      <>
        <H2>Thông tin khóa học</H2>
        <form ref={formRef} onSubmit={handleSubmit}>
            <Label style={{ flex: '1' }} gap="2px" margin='0 0 12px 0'>
                Tên khóa học:
                <Input name="courseName" value={form.courseName} onChange={handleChange} placeholder="Nhập tên khóa học" />
            </Label>
            <Label margin='0 0 2px 0' htmlFor="courseDescription">Mô tả khóa học:</Label>
            <JoditEditor
                margin='0 0 12px 0'
                name="courseDescription"
                value={form.courseDescription}
                onChange={handleChange}
            />
            <FormChild>
                <Label style={{ flex: '1' }} margin='0 0 12px 0'>
                    <Label htmlFor="courseCategoryId" margin='0 0 2px 0'>Tên danh mục:</Label>
                    <InlineFlex>
                        <Select
                            name="courseCategoryId"
                            options={[]}
                            value={form.courseCategoryId}
                            onChange={handleChange}
                            placeholder="Chọn tên danh mục"
                        />
                        <Button type='button' backgroundColor='var(--success-color)' width='60px'>Thêm</Button>
                    </InlineFlex>
                </Label>
                <Label style={{ flex: '1' }} gap="2px" margin='0 0 12px 0'>
                    Số lượng học viên:
                    <Input type="number" min="0" step="1" name="courseMaxStudent" value={form.courseMaxStudent} onChange={handleChange} />
                </Label>
                <Label style={{ flex: '1' }} gap="2px" margin='0 0 12px 0'>
                    Giá khóa học:
                    <Input type="number" min="0" step="1000" name="coursePrice" value={form.coursePrice} onChange={handleChange} />
                </Label>
            </FormChild>
            <FormChild>
                <Label style={{ flex: '1' }} gap="2px" margin='0 0 12px 0'>
                    Ngày bắt đầu:
                    <Input type="date" name="courseStartDate" value={form.courseStartDate} onChange={handleChange} />
                </Label>
                <Label style={{ flex: '1' }} gap="2px" margin='0 0 12px 0'>
                    Ngày kết thúc:
                    <Input type="date" name="courseEndDate" value={form.courseEndDate} onChange={handleChange} />
                </Label>
                <Label style={{ flex: '1' }} gap="2px" margin='0 0 12px 0'>
                    Trạng thái:
                    <Select
                        clear={false}
                        name="courseStatus"
                        options={statuss}
                        value={form.courseStatus}
                        onChange={handleChange}
                        placeholder="Chọn trạng thái"
                    />
                </Label>
            </FormChild>
        </form>
        <ButtonBox>
          <ButtonMod backgroundColor='#dcdcdc' style={{ color: "var(--text-color)" }} onClick={() => { setIsView(true) }}>Xem</ButtonMod>
          <ButtonMod disabled={waitProcess} backgroundColor='var(--primary-color)' 
            onClick={handleSubmitButton}>{waitProcess ? (!isUpdate ? "Đang tạo..." : 'Đang lưu...')
            : (!isUpdate ? "Tạo" : 'Lưu')}
          </ButtonMod>
        </ButtonBox>
    </>
  );
};

export default CourseEditor;
