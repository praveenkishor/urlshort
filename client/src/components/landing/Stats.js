import React from "react";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import {fetchShortUrl} from "../../APIHelper";
class Stats extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          data: [],
          perPage: 2,
          currentPage: 0
      };
      this.handlePageClick = this.handlePageClick.bind(this);
      this.shortdata = this.shortdata.bind(this);
      this.countClick = this.countClick.bind(this);
  }

  countClick(e){
    let reqObj = {
      originalUrl: e.target.href
    };
    fetchShortUrl(reqObj)
        .then(json => {
          setTimeout(() => {
           console.log(json.data)
          }, 0);
        })
        .catch(error => {
          
        });
  }
  receivedData() {
      axios
          .get(`http://localhost:3001/api/items`)
          .then(res => {
  
              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(pd => <React.Fragment key={Math.random()}>
                  <p>{pd.originalUrl}</p>
                  <a target="_blank" onClick={this.countClick} href={pd.originalUrl}>
                   {pd.shortUrl}
                  </a>
              <p>Total Clicks : {(pd.clickstotal) ? pd.clickstotal : 0}</p>
              <p>Top Countries : {this.shortdata(pd.region)}</p>
              </React.Fragment>)
  
              this.setState({
                  pageCount: Math.ceil(data.length / this.state.perPage),
                  postData
              })
          });
  }

  shortdata(temp){
    var obj = temp;
    var sortable = [];
    for (var key in obj) {
        sortable.push([key, obj[key]]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    
    var temp1 = []
    for(let i=0;i<3;i++){
    temp1.push(sortable[i])
    }
    
    var returnstr = "";
    temp1.forEach(function(item) {
      if(item){
      Object.keys(item).forEach(function(key) {
        returnstr += " ("+item[key] +")";
      });
        }
    });
    return returnstr;
  }
  handlePageClick = (e) => {
      const selectedPage = e.selected;
      const offset = selectedPage * this.state.perPage;
  
      this.setState({
          currentPage: selectedPage,
          offset: offset
      }, () => {
          this.receivedData()
      });
  
  };
  
  componentDidMount() {
      this.receivedData()
  }
  render() {
      return (
          <div>
              {this.state.postData}
              <ReactPaginate
                  previousLabel={"prev"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}/>
          </div>
  
      )
  }
  }

  export default Stats;