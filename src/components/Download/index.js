import React, { Component } from 'react';
import { Spin } from 'antd';
import { baseRequest } from 'utils/request';
import { getToken, toFullPath } from 'utils/request/utils';
import styles from './index.less';

export ExportDownload from './ExportDownload';

export default class Download extends Component {
  static defaultProps = {
    query: {},
    async: true,
  };

  state = {
    data: null,
    loading: false,
  }


  componentDidMount() {
    const { async } = this.props;
    if (!async) {
      this.getEncData();
    }
  }
  componentWillReceiveProps() {
    this.setState({
      data: null,
    });
  }

  getEncData = () => {
    const { query = {} } = this.props;
    query.token = getToken();
    console.log({ query });


    this.setState({
      loading: true,
    });
    return baseRequest('/api/encode-get', {
      body: query,
    })
      .then(data => data.text())
      .then((data) => {
        this.setState({ data, loading: false });
        return data;
      });
  }


  getData = (e) => {
    // console.log(e);
    if (!this.state.data) {
      e.preventDefault();
      this.getEncData().then((data) => {
        if (data) {
          this.link?.click();
        }
      });
    }
  }

  getDownloadLink() {
    const { baseUrl } = this.props;
    const { data } = this.state;
    return toFullPath(`/download${baseUrl}?data=${encodeURIComponent(data)}`);
  }

  getLinkTitle() {
    const { children, title } = this.props;
    return title || children || '下载';
  }

  render() {
    const { async } = this.props;
    const { data } = this.state;
    return (
      <div className={styles.download}>
        <Spin spinning={this.state.loading} size="small">
          {
          data ? (
            <a
              ref={(ref) => { this.link = ref; }}
              href={this.getDownloadLink()}
            >{this.getLinkTitle()}
            </a>
            ) : (
            async ? (
              <a
                ref={(ref) => { this.link = ref; }}
                onClick={this.getData}
                href={this.getDownloadLink()}
              >{this.getLinkTitle()}
              </a>
            )
            : <span>{this.getLinkTitle()}</span>
          )

        }
        </Spin>
      </div>
    );
  }
}
