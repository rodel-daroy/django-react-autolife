import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import 'what-input';
import { withRouter } from 'react-router-dom';
import CoreLayout from './layouts/CoreLayout';
import PrivateRoute from './routes/privateRoutes';
import AdminRoute from './routes/adminRoutes';
import ErrorBoundary from 'components/common/ErrorBoundary';
import Home from 'routes/HomePage';
import Admin from 'routes/Admin';
/* import Marketplace, {
  BrowseCarDetail,
  BrowseHome,
  TradeInValue,
  FutureValue,
  AveragePrice,
  ShopCars,
  Recall,
  RecallResults
} from 'routes/MarketPlace';
import Insurance, { QuoteIntro, QuoteForm } from 'routes/Insurance'; */
import { AllArticlesView, ArticleView } from 'routes/Articles';
import VideoWall from 'routes/VideoWall';
import Register from 'routes/SoftRegistration';
import Profile from 'routes/ProfilePage';
import { refreshUserToken, verifyUserToken } from 'redux/actions/userActions';
import Search from 'routes/NavigationSearch';
import ContactUs from 'routes/ContactUsForm';
import CMSPageView from 'routes/EditorialTemplates';
/* import CBBListing from 'routes/CBBListing';
import CBBDetail from 'routes/CBBDetail'; */
import QuickSight from 'routes/QuickSight';
import CMSTemplateList from 'routes/CMSTemplateList';
import NotFound from 'routes/NotFound';
import AutoShow, { AutoShowWinView, OttawaAutoShow } from 'routes/AutoShow';
import GregCarrascoView from 'routes/GregCarrasco';
import SiriusXM from 'routes/SiriusXM';
import CarsAndJobs from 'routes/CarsAndJobs';
import UpdatePasswordView from 'routes/UpdatePassword/components/UpdatePasswordView';
import SpringGetaway from 'routes/SpringGetaway';
import { ArticleEditView, ContentTilesView } from "routes/Admin";
import ShoppingPlaceholder from 'routes/ShoppingPlaceholder';

class App extends Component {
  render() {
    return (
      <CoreLayout>
        <ErrorBoundary>
          <Switch>
            <Route exact path="/" component={Home} />
            <AdminRoute exact path="/analytics" component={QuickSight} />
            <Route exact path="/reset-password" component={UpdatePasswordView} />
            <Route exact path="/shopping" component={ShoppingPlaceholder} />
            <Route exact path="/market-place" component={ShoppingPlaceholder} />
            <Route
              exact
              path="/market-place/browse-cars/:id"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/market-place/browse-cars/:id/:subcategory_id"
              component={ShoppingPlaceholder}
            />
            {/* <Route exact path="content/:content_name" component={CMSPageView} /> */}
            <Route exact path="/content/:content_name" component={CMSPageView} />
            <Route
              exact
              path="/content/preview/:content_name"
              component={CMSPageView}
            />
            <Route exact path="/insurance" component={ShoppingPlaceholder} />
            <Route exact path="/articles" component={ArticleView} />
            <Route
              exact
              path="/articles/allarticles/:mappingId"
              component={AllArticlesView}
            />
            <Route
              exact
              path="/market-place/browse-detail/:trim_id/:make/:model"
              component={ShoppingPlaceholder}
            />
            <Route exact path="/autolife-stories" component={VideoWall} />
            <Route
              path="/shopping/vehicle-search/:model/:year/:make"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/insurance/quote"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/insurance/quote/form"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/shopping/vehicle-details/:trim_id/:body_style_id/:color_code"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/shopping/vehicle-details/:trim_id/:body_style_id"
              component={ShoppingPlaceholder}
            />
            <Route exact path="/softregistration" component={Register} />
            <Route exact path="/contact-us" component={ContactUs} />
            <Route
              exact
              path="/market-place/tools/average-price"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/market-place/tools/trade-in-value"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/market-place/tools/future-value"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/market-place/tools/recall"
              component={ShoppingPlaceholder}
            />
            <Route
              exact
              path="/market-place/tools/recall/:year/:make/:model"
              component={ShoppingPlaceholder}
            />
            <Route exact path="/search" component={Search} />
            <Route exact path="/autoshow" component={AutoShow} />
            <Route exact path="/autoshow/win" component={AutoShowWinView} />
            <Route exact path="/autoshow/ottawa" component={OttawaAutoShow} />
            <Route exact path="/greg-carrasco" component={GregCarrascoView} />
            <Route exact path="/siriusxm" component={SiriusXM} />
            <Route exact path="/jobs" component={CarsAndJobs} />
            <Route exact path="/spring-getaway" component={SpringGetaway} />

            <PrivateRoute
              exact
              path="/template-list"
              component={CMSTemplateList}
            />
            <PrivateRoute exact path="/page" component={/* CMSPage */ ArticleEditView} />
            <AdminRoute exact path="/page/:id" component={ArticleEditView} />
            <AdminRoute exact path="/admin" component={Admin} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <AdminRoute
              exact
              path="/content/preview/:content_name"
              component={ArticleEditView}
            />

            <AdminRoute exact path="/tiles" component={ContentTilesView} />
            <AdminRoute exact path="/tiles/:categoryId" component={ContentTilesView} />

            <Route component={NotFound} />
          </Switch>
        </ErrorBoundary>
      </CoreLayout>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  refreshUserToken,
  verifyUserToken
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
