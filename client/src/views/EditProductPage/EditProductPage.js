import React, { useEffect, useState } from 'react';
import { Typography, Button, Form, Input } from 'antd';
import Icon, { FileOutlined } from '@ant-design/icons';
import FileUpload from '../../components/FileUpload';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const condition = [
  { key: 1, value: 'Brand new' },
  { key: 2, value: 'New' },
  { key: 3, value: 'Used' },
  { key: 4, value: 'Good' },
  { key: 5, value: 'Old' },
];
const level = [
  { key: 1, value: 'Undergraduate' },
  { key: 2, value: 'Graduate' },
  { key: 3, value: 'PHD' },
];
const department = [
  { key: 1, value: 'Herbert Wertheim College of Engineering' },
  { key: 2, value: 'College of the Arts' },
  { key: 3, value: 'Warrington College of Business' },
  { key: 4, value: 'College of Education' },
  { key: 5, value: 'College of Medicine' },
  { key: 6, value: 'Levin College of Law' },
  { key: 7, value: 'Fisher School of Accounting' },
];
const category = [
  { key: 1, value: 'Finance' },
  { key: 2, value: 'Physics' },
  { key: 3, value: 'Math' },
  { key: 4, value: 'Arts' },
  { key: 5, value: 'Music' },
];

function EditProductPage(props) {
  const productId = props.match.params.productId;
  const [TitleValue, setTitleValue] = useState('');
  const [DescriptionValue, setDescriptionValue] = useState('');
  const [authorValue, setauthorValue] = useState('');
  const [professorValue, setprofessorValue] = useState('');
  const [codeValue, setcodeValue] = useState('');
  const [isbnValue, setisbnValue] = useState('');
  const [PriceValue, setPriceValue] = useState(0);
  const [versionValue, setversionValue] = useState(0);
  const [conditionValue, setconditionValue] = useState(1);
  const [levelValue, setlevelValue] = useState(1);
  const [departmentValue, setdepartmentValue] = useState(1);
  const [categoryValue, setcategoryValue] = useState(1);
  const [Images, setImages] = useState([]);

  useEffect(() => {
    Axios.get(`/api/product/products_by_id?id=${productId}&type=single`).then(
      (response) => {
        setTitleValue(response.data[0].title);
        setDescriptionValue(response.data[0].description);
        setauthorValue(response.data[0].author);
        setprofessorValue(response.data[0].professor);
        setcodeValue(response.data[0].code);
        setisbnValue(response.data[0].ISBN);
        setPriceValue(response.data[0].price);
        setversionValue(response.data[0].version);
        setconditionValue(response.data[0].condition);
        setlevelValue(response.data[0].level);
        setdepartmentValue(response.data[0].department);
        setcategoryValue(response.data[0].category);
      }
    );
  }, []);

  const onTitleChange = (event) => {
    setTitleValue(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescriptionValue(event.currentTarget.value);
  };

  const onauthorChange = (event) => {
    setauthorValue(event.currentTarget.value);
  };

  const onprofessorChange = (event) => {
    setprofessorValue(event.currentTarget.value);
  };

  const oncodeChange = (event) => {
    setcodeValue(event.currentTarget.value);
  };

  const onisbnChange = (event) => {
    setisbnValue(event.currentTarget.value);
  };

  const onPriceChange = (event) => {
    setPriceValue(event.currentTarget.value);
  };

  const onversionChange = (event) => {
    setversionValue(event.currentTarget.value);
  };

  const onconditionSelectChange = (event) => {
    setconditionValue(event.currentTarget.value);
  };

  const onlevelSelectChange = (event) => {
    setlevelValue(event.currentTarget.value);
  };

  const ondepartmentSelectChange = (event) => {
    setdepartmentValue(event.currentTarget.value);
  };

  const oncategorySelectChange = (event) => {
    setcategoryValue(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (
      !TitleValue ||
      !DescriptionValue ||
      !categoryValue ||
      !departmentValue ||
      !levelValue ||
      !authorValue ||
      !isbnValue ||
      !professorValue ||
      !codeValue ||
      !PriceValue ||
      !conditionValue ||
      !versionValue ||
      !Images
    ) {
      return alert('fill all the fields first!');
    }

    const variables = {
      writer: props.user.userData._id,
      username: props.user.userData.fullname,
      usermajor: props.user.userData.major,
      userphone: props.user.userData.phone,
      userbio: props.user.userData.description,
      useraddr: props.user.userData.address,
      title: TitleValue,
      author: authorValue,
      code: codeValue,
      professor: professorValue,
      ISBN: isbnValue,
      description: DescriptionValue,
      price: PriceValue,
      version: versionValue,
      images: Images,
      condition: conditionValue,
      level: levelValue,
      department: departmentValue,
      category: categoryValue,
    };

    Axios.put(`/api/product/products_by_id?id=${productId}`, variables).then(
      (response) => {
        if (response.data.success) {
          alert('Product Successfully Updated');
          props.history.push('/textbook');
        } else {
          alert('Failed to update Product');
        }
      }
    );
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>
          {' '}
          Edit My Textbooks <FileOutlined type='book' />
        </Title>
      </div>
      <Form onSubmit={onSubmit}>
        <label>Title</label>
        <Input onChange={onTitleChange} value={TitleValue} />
        <br />
        <br />
        <label>Author</label>
        <Input onChange={onauthorChange} value={authorValue} />
        <br />
        <br />
        <label>Version</label>
        <Input onChange={onversionChange} value={versionValue} type='number' />
        <br />
        <br />
        <label>ISBN</label>
        <Input onChange={onisbnChange} value={isbnValue} />
        <br />
        <br />
        <label>Condition: </label>
        <select onChange={onconditionSelectChange} value={conditionValue}>
          {condition.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}{' '}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Course Code</label>
        <Input onChange={oncodeChange} value={codeValue} />
        <br />
        <br />
        <label>Professor</label>
        <Input onChange={onprofessorChange} value={professorValue} />
        <br />
        <br />
        <label>Program Level: </label>
        <select onChange={onlevelSelectChange} value={levelValue}>
          {level.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}{' '}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Department: </label>
        <select onChange={ondepartmentSelectChange} value={departmentValue}>
          {department.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}{' '}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Category: </label>
        <select onChange={oncategorySelectChange} value={categoryValue}>
          {category.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}{' '}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={DescriptionValue} />
        <br />
        <br />
        <label>Price($)</label>
        <Input onChange={onPriceChange} value={PriceValue} type='number' />
        <br />
        <br />
        {/* DropZone */}
        <label>Upload images</label>
        <FileUpload refreshFunction={updateImages} />
        <p style={{ color: 'red' }}>
          *drop or choose from files, left click image to delete on right area
        </p>
        <Button onClick={onSubmit} type='dashed' size='large'>
          Update Post
        </Button>
      </Form>
    </div>
  );
}

export default EditProductPage;
