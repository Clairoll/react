import { Upload, Icon, message } from 'antd';
import React, { Component } from "react";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片格式只能支持jpg/png格式');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片不能超过2M');
  }
  return isJpgOrPng && isLt2M;
}

class Avatar extends Component {
  constructor(props) {
      super(props)
      this.state = {
        loading: false,
        imageUrl:""
      }
  }

  handleChange = info => {
    // if (info.file.status === 'uploading') {
    //   this.setState({ loading: true });
    //   return;
    // }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl =>    
        this.setState({
          imageUrl:imageUrl,
          loading: false,
        },
        () => this.props.onChange(info.file.response.imageUrl)),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    const { imageUrl } = this.state;
    
    const defalutImg = imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton
    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/view/imgUpload"
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {this.props.imageUrl ? <img src={this.props.imageUrl} alt="avatar" style={{ width: '100%' }} />:defalutImg}
      </Upload>
    );
  }
}

export default Avatar