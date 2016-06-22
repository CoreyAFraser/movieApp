var socket = io();

var SearchTerm = React.createClass({
  getInitialState: function() {
    return {searchTerm : 'Batman'};
  },
  componentDidMount: function() {
      socket.on('updateSearchTerm', this.updateSearchTerm);
  },
  updateSearchTerm: function(term) {
    this.setState({searchTerm : term});
  },
  render() {
    return (
    	<div>
        	{this.state.searchTerm}
        </div>
    );
  }
});
ReactDOM.render(
  <SearchTerm/>,
  document.getElementById('searchTerm')
);

var MovieResults = React.createClass({
  getInitialState: function() {
    return {movies : []};
  },
  componentDidMount: function() {
      socket.on('updateResults', this.updateResults);
  },
  updateResults: function(results) {
    this.setState({movies : results});
  },
  ratingClickHandler: function(e) {
    
  },
  render: function() {
    var movieNodes = [];
    
    for(var i=0;i<this.state.movies.length;i++) {
    	var movie = this.state.movies[i];
      	movieNodes.push(
      	<div className='col-xs-6 col-md-4 movieContainer' key={movie.imdbID}>
      		<div className='row movieNode'>
      			<div className='col-xs-8 movieInfo'>
      				<div className='col-xs-12 movieTitleYear'>
      					<div className='col-xs-12 movieTitle'>
      						<b>{movie.Title}</b>
      					</div>
      					<div className='col-xs-12 movieYear'>
      						Year: {movie.Year}
      					</div>
      				</div>
      				<div className='col-xs-12 movieRating'>
      					{movie.rating}
      				</div>
      			</div>
      			<div className='col-xs-4 moviePoster'>
      			</div>
      		</div>
      	</div>);
    }

    return (
   			<div className="row" onClick={this.ratingClickHandler}>
          		{movieNodes}
        	</div>
		);
  }
});
ReactDOM.render(
  <MovieResults/>,
  document.getElementById('results')
);

var Pagination = React.createClass({
	getInitialState: function() {
    	return { numberOfPages : 0,
    			 currentPage : 0};
  	},
  	componentDidMount: function() {
      	socket.on('updatePagination', this.updatePagination);
  	},
  	updatePagination: function(pageData) {
    	this.setState({ numberOfPages : pageData.numberOfPages,
    					currentPage : pageData.currentPage});
  	},
  	pageClickHandler: function(e) {
  		if($(e.target).hasClass('pageLink')) {
  			socket.emit("updatePage", $(e.target).attr('id'));
  		}
  	},
  	render: function() {
   		var pageLinks = [];
   		var start = this.state.currentPage - 5;
   		if(start < 1) {
   			start = 1;
   		}
   		var end = start + 9;
   		if(end > this.state.numberOfPages) {
   			end = this.state.numberOfPages;
   		}

		if(start > 1) {
			pageLinks.push(<a className='col-xs-1 pageLink' id='Prev' key='Prev'>Prev</a>);
			end--;
		}

		for (var i = start; i < end + 1; i++) {
			if(i == this.state.currentPage) {
  				pageLinks.push(<a className='col-xs-1 pageLink disabled' id={i} key={i}>{i}</a>);
  			} else {
  				pageLinks.push(<a className='col-xs-1 pageLink'  id={i} key={i}>{i}</a>);
  			}
		}

		if(this.state.numberOfPages > end) {
			pageLinks.push(<a className='col-xs-1 pageLink' id='Next' key='Next'>Next</a>);
		}
		return (
   			<div className='pagesLinks row' onClick={this.pageClickHandler}>
    			{pageLinks}
   			</div>
		);
	}
});
ReactDOM.render(
  <Pagination/>,
  document.getElementById('pagination')
);
