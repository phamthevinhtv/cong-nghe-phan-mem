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
  align-items: flex-end;
  gap: 6px;
  width: 100%;
  z-index: 0;
  flex: 1;
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

const Overlay = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color:rgba(0, 0, 0, 0.3);
    z-index: 10;
    display: flex;
    padding: 24px;
`;

const ContainerCreCourseCate = styled.div`
  width: 400px;
  margin: auto;
  background-color: var(--white-color);
  border-radius: 6px;
  border: var(--border-normal);
  padding: 24px;
`;

const CourseEditor = ({ form, setForm, mode, setIsView }) => {
  const formRef = useRef();
  const [waitProcess, setWaitProcess] = useState(false); 
  const [waitCreCourseCate, setWaitCreCourseCate] = useState(false); 
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpenCreCourseCate, setIsOpenCreCourseCate] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]); 
  const [courseCateName, setCourseCateName] = useState('');

  useEffect(() => {
    if(mode == 'Create') {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
    }
    getCourseCategories();
  }, [mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCourseCateNameChange = (e) => {
    setCourseCateName(e.target.value);
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (form.courseStartDate) {
      const startDate = new Date(form.courseStartDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate.getTime() < today.getTime()) {
        toast.warning('Ngày bắt đầu phải bằng hoặc sau ngày hiện tại.', { position: 'top-right', autoClose: 3000 });
        emptyInputWarning('courseStartDate');
        return;
      }
    }
    if (form.courseEndDate) {
      const endDate = new Date(form.courseEndDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate.getTime() < today.getTime()) {
        toast.warning('Ngày kết thúc phải bằng hoặc sau ngày hiện tại.', { position: 'top-right', autoClose: 3000 });
        emptyInputWarning('courseEndDate');
        return;
      }
    }
    if (form.courseStartDate && form.courseEndDate) {
      const startDate = new Date(form.courseStartDate);
      const endDate = new Date(form.courseEndDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      if (startDate.getTime() > endDate.getTime()) {
        toast.warning('Ngày bắt đầu phải bằng hoặc trước ngày kết thúc.', { position: 'top-right', autoClose: 3000 });
        emptyInputWarning('courseStartDate');
        emptyInputWarning('courseEndDate');
        return;
      }
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

  const handleBtnCreCourseCate = () => {
    setIsOpenCreCourseCate(true);
    document.querySelector('main').style.zIndex = '11';
  }

  const handleCloseCreCourseCate = () => {
    setIsOpenCreCourseCate(false);
    document.querySelector('main').style.zIndex = '0';
  }

  const handleSubmitCreCourseCate = async (e) => {
    e.preventDefault();
    if (courseCateName.length <= 0) {
      toast.warning('Vui lòng nhập tên danh mục khóa học.', { position: 'top-right', autoClose: 3000 });
      emptyInputWarning('courseCateName');
      return;
    }
    setWaitCreCourseCate(true);
    try {
        const response = await axios.post('http://localhost:5000/api/course/create-course-category', { courseCateName }, { withCredentials: true });
        toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
        getCourseCategories();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
        setWaitCreCourseCate(false);
    }
  }

  const getCourseCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course/course-categories`, { withCredentials: true });
      if (response.data.courseCategories) {
        const format = response.data.courseCategories.map(cat => ({
          label: cat.courseCategoryName,
          value: cat.courseCategoryId
        }));
        setCourseCategories(format);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh mục khóa học:', err);
    }
  };

  return (
      <>
        <Overlay onClick={handleCloseCreCourseCate} style={{ display: isOpenCreCourseCate ? 'flex' : 'none' }}>
          <ContainerCreCourseCate onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmitCreCourseCate}>
              <Label gap="2px" margin="0 0 12px 0">
                Tên danh mục khóa học:
                <Input name="courseCateName" value={courseCateName} onChange={handleCourseCateNameChange} placeholder="Nhập tên danh mục khóa học" />
              </Label>
              <Button disabled={waitCreCourseCate} margin="12px 0 0 0">{ waitCreCourseCate ? "Đang tạo..." : "Tạo" }</Button>
            </form>
            <Button backgroundColor='#dcdcdc' onClick={handleCloseCreCourseCate} style={{ color: "var(--text-color)" }} margin="12px 0 0 0">Trở lại</Button>
          </ContainerCreCourseCate>
        </Overlay>
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
                <InlineFlex>
                  <Label style={{ flex: '1' }} margin='0 0 12px 0'>
                    <Label htmlFor="courseCategoryId" margin='0 0 2px 0'>Tên danh mục:</Label>
                    <Select
                      name="courseCategoryId"
                      options={courseCategories}
                      value={form.courseCategoryId}
                      onChange={handleChange}
                      placeholder="Chọn tên danh mục"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Label>
                  <Button type='button' margin='0 0 12px 0' backgroundColor='var(--success-color)' width='60px' onClick={handleBtnCreCourseCate}>Thêm</Button>
                </InlineFlex>
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
