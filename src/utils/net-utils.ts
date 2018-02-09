
export class NetUtils {
  static request(url: string, options:any): Promise<any> {
    return fetch(url, options)
      .then((response) => {
          return response.json();
      })
      .catch((error) => {
          console.log(error);
          return {code:-1, message:'网络连接失败', data:{}}
      });
  };

  /**
   *url :请求地址
    *data:参数(Json对象)
    */
  static postJson(url: string, data: any): Promise<any> {
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    return NetUtils.request(url, fetchOptions);
  }

  static graphqlJson(url: string, data: any) : Promise<any> {
    console.log('graphqlJson url' + url + '; data=' + data);
    var fetchOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/graphql'
      },
      credentials: 'include',
      body: data
    };
    return NetUtils.request(url, fetchOptions);
  }


  //get请求
  /**
   *url :请求地址
    */
  static get(url: string): Promise<any> {
    return NetUtils.request(url, null);
  }
}