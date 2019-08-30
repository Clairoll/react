import React, { Component } from "react";
import { Breadcrumb, Form, Input, Select, Button, message } from "antd";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { browserHistory } from "react-router";
import axios from "../../utils/https";
import Avatar from "../../utils/imgUpload";

const FormItem = Form.Item;
const Option = Select.Option;
class Writearticle extends Component {
  mdParser = null;
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      user: [],
      title: "",
      imageUrl: "",
      categoryId: "1",
      userId: "1",
      content: "请输入文章内容",
      isLoading: false,
      articleId: undefined
    };
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return "";
      }
    });
  }
  handleEditorChange({ html, md }) {
    this.setState({
      content: html
    });
  }
  componentDidMount() {
    let id = this.props.location.query.id;
    if (id) {
      // this.fetchData({
      //   url: "/admin/article/edit",
      //   data: { id },
      //   attr: [
      //     "title",
      //     "imageUrl",
      //     "categoryId",
      //     "userId",
      //     "content",
      //     "articleId"
      //   ]
      // });
        axios({
          method: "post",
          url: "/admin/article/edit",
          data: {
            id: id
          }
        }).then(res => {
          if (res.code === 200) {
            this.setState({
              title: res.article.title,
              imageUrl: res.article.img,
              categoryId: res.article.categoryId,
              userId: res.article.userId,
              content: res.article.content,
              articleId: id
            });
          }
        });
    }
    this.fetchData({ url: "/admin/category", attr: ["category"] });
    this.fetchData({ url: "/admin/user", attr: ["user"] });
  }

  fetchData = ({ url = "", method = "post", data = {}, attr = [] }) => {
    axios({
      method,
      url,
      data
    }).then(res => {
      console.log(res[attr[0]]);
      if (res.code === 200) {
        for (let i = 0; i < attr.length; i++) {
          this.setState({
            [attr[i]]: res[attr[i]]
          });
        }
        if (res.messages) {
          message.success(res.messages);
        }
      } else {
        message.error(res.messages);
      }
      return;
    });
  };
  render() {
    const { state } = this;
    return (
      <div>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>文章</Breadcrumb.Item>
          <Breadcrumb.Item>写文章</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 600 }}>
          <div>{this.renderFrom()}</div>
          <div style={{ height: 500, marginTop: 20 }}>
            <MdEditor
              value={state.content}
              renderHTML={text => this.mdParser.render(text)}
              onChange={this.handleEditorChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

  renderFrom = () => {
    const { state, props } = this;
    const { getFieldDecorator } = props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit.bind(this)}>
        <FormItem label="标题">
          {getFieldDecorator("title", {
            initialValue: state.title,
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入文章标题"
              }
            ]
          })(
            <Input
              style={{ width: 300, marginRight: 10 }}
              maxLength={20}
              placeholder="请输入文章标题"
            />
          )}
        </FormItem>
        <FormItem label="图片">
          {getFieldDecorator("imageUrl", {
            initialValue: state.imageUrl,
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入图片地址"
              }
            ]
          })(<Avatar imageUrl={state.imageUrl} />)}
        </FormItem>
        <FormItem label="分类">
          {getFieldDecorator("categoryId", {
            initialValue: state.categoryId,
            rules: [
              {
                whitespace: true,
                message: "请选择分类"
              }
            ]
          })(
            <Select placeholder="请选择" style={{ width: 300 }}>
              {state.category.map((item, index) => (
                <Option key={index} value={String(item.id)}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="作者">
          {getFieldDecorator("userId", {
            initialValue: state.userId,
            rules: [
              {
                whitespace: true,
                message: "请选择作者"
              }
            ]
          })(
            <Select placeholder="请选择" style={{ width: 300 }}>
              {state.user.map((item, index) => (
                <Option key={index} value={String(item.id)}>
                  {item.username}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit" loading={state.isLoading}>
            提交
          </Button>
        </FormItem>
      </Form>
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    const { props, state } = this;
    props.form.validateFieldsAndScroll(
      { force: true },
      async (errors, values) => {
        let pramas = {
          title: values.title,
          userId: values.userId,
          categoryId: values.categoryId,
          img: values.imageUrl,
          content: state.content
        };

        if (!errors) {
          if (state.articleId) {
            pramas.id = state.articleId;
            await this.fetchData({ url: "/admin/article/edit", data: pramas });
            setTimeout(() => {
              browserHistory.push("/article");
            }, 2000);
          } else {
            await this.fetchData({ url: "/admin/writeArticle", data: pramas });
            setTimeout(() => {
              browserHistory.push("/article");
            }, 2000);
          }
        }
      }
    );
  };
}

export default Writearticle = Form.create({})(Writearticle);
