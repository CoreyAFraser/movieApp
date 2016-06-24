var socket = io();
var localSearchTerm;
var page = 1;

var updateAndStoreRating = function(movieId, newRating) {
  localStorage.setItem(movieId, newRating);
}

var getRatingById = function(movieId) {
  return localStorage.getItem(movieId);
}

window.onpopstate = function(event) {
  if(event.state) {
  	page = event.state.page;
  	socket.emit("updatePage", event.state.page);
  }
};

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

var MovieStarRating = React.createClass({
  ratingClickHandler: function(e) {
    if($(e.target).hasClass('glyphicon')) {
      var clickedRating = $(e.target).attr('id');
      var movieId = $(e.target.parentElement).attr('id');

      var stars = $(e.target.parentElement).find('.glyphicon');
      for(var i=0;i<stars.length;i++) {
        if(i < clickedRating) {
          $(stars[i]).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
        } else {
          $(stars[i]).addClass('glyphicon-star-empty').removeClass('glyphicon-star');
        }
      }

      updateAndStoreRating(movieId, clickedRating);
    }
  },
  render: function() {
    var starNodes = [];
    var numberOfEmptyStars = 5 - this.props.rating;
    for(var i=0;i<5;i++) {
      if(i < this.props.rating) {
        starNodes.push(<span key={i} id={i+1} className="glyphicon glyphicon-star" aria-hidden="true"></span>);
      } else {
        starNodes.push(<span key={i} id={i+1} className="glyphicon glyphicon-star-empty" aria-hidden="true"></span>);
      }
    }
    return (
        <div className="row" id={this.props.movieId} onClick={this.ratingClickHandler}>
          {starNodes}
        </div>
    );
  }
});

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
  render: function() {
    var movieNodes = [];
    
    for(var i=0;i<this.state.movies.length;i++) {
    	var movie = this.state.movies[i];
      var rating = getRatingById(movie.imdbID);
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
      					<MovieStarRating rating={rating} movieId={movie.imdbID}/>
      				</div>
      			</div>
      			<div className='col-xs-4 moviePoster'>
      				<img className='moviePosterImg' src={movie.Poster}/>
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
		var stateObj = { page : 1 };
		history.pushState(stateObj, "page1", "");
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
  		var clickedPage = $(e.target).attr('id');
  		if(clickedPage == 'Prev') {
		    page--;
		  } else {
		    if(clickedPage == 'Next') {
		      page++;
		    } else {
		      page = clickedPage;
		    }
		  }

		  var stateObj = { page : page };
		  history.pushState(stateObj, "page" + page, "");

  		socket.emit("updatePage", page);
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
