/**
 * Created by jiang on 16/12/20.
 */
import React, { Component } from 'react'
import {
    View,
    Image,
    ScrollView,
    ListView,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Animated,
    Easing,
    ActivityIndicator
} from 'react-native'
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';

export default class TestListView extends Component {
    constructor(props) {
        super(props);
        this.tbvHeight = props.tbvHeight;
        this.renderRowCallback = props.renderRowCallback;
        this.networkParams = props.networkParams;
        this.defaultPageItem = props.defaultPageItem; // 默认每一page能刷多少条，配合最后刷新
        this.canLoadMore = true;

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
        });
        this.state = {
            marginDistance: new Animated.Value(0),
            dataSource: ds,
            theNetworkData: [],
            isLoadingMore: false,
        };
    }
    getData() {
        return this.state.theNetworkData;
    }
    _onRefresh(refresh) {
        this._getRecord(1, refresh);
    }
    _onEndReached(event) {
        if (this.tbvOffsetY > 5 && this.canLoadMore == true) {
            this._getRecord(2,null);
        }
    }
    _getRecord(type, refresh) {
        if (type == 1) {
            this.page = 1;
            if (refresh == null) {
            }
        }
        else {
            if (this.state.isLoadingMore == true) {
                return;
            }
            this.page ++;
            this.setState({isLoadingMore: true});
        }
        var body = null;
        if (this.networkParams[1].indexOf("@") != -1) {
            var bodyArr = this.networkParams[1].split("@");
            var body = bodyArr[0]+this.page+bodyArr[1];
        }
        setTimeout(function () {
            fetch(this.networkParams[0]+body)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (refresh != undefined && refresh != null) {
                        // refresh.onRefreshEnd();
                    }
                    else {
                    }
                    if (type == 2) {
                        this.setState({isLoadingMore: false});
                    }
                    if (responseJson != undefined && responseJson != null) {
                        if (responseJson.tracks.length > 0) {
                            if (type == 1) {
                                var temp = responseJson.tracks;
                                temp.push("");
                                this.setState({theNetworkData: temp});
                            }
                            else {
                                var temp = this.state.theNetworkData;
                                temp.pop();
                                temp = temp.concat(responseJson.tracks);
                                temp.push("");
                                this.setState({theNetworkData: temp});
                            }
                            if (responseJson.tracks.length < this.defaultPageItem) {
                                this.canLoadMore = false;
                            }
                            else {
                                this.canLoadMore = true;
                            }
                        }
                    }
                    else {
                        this.page --;
                    }
                })
                .catch((error) => {
                    // this.page --;
                    // if (refresh != null) {
                    //     refresh.onRefreshEnd();
                    // }
                    // else {
                    //     Public.hideHUD();
                    // }
                    // if (type == 2) {
                    //     this.setState({isLoadingMore: false});
                    // }
                });
        }.bind(this), 3000);
    }
    _renderRow(rowData, sectionId, rowId) {
        if (rowId == this.state.theNetworkData.length - 1) {
            return (<ActivityIndicator style={{height: 50}} animating={this.state.isLoadingMore} color="black" />);
        }
        return this.renderRowCallback(rowData, sectionId, rowId);
    }
    render() {
        return(
            <ListView
                ref={(ref) => this.tbv = ref}
                renderScrollComponent={(props) => <PullRefreshScrollView onRefresh={(PullRefresh)=>this._onRefresh(PullRefresh)} {...props}     />}
                dataSource={this.state.dataSource.cloneWithRows(this.state.theNetworkData)}
                renderRow={(rowData, sectionId, rowId) => this._renderRow(rowData, sectionId, rowId)}
                onEndReachedThreshold={200}
                scrollEventThrottle={200}
                onScroll={(event)=>this.tbvOffsetY = event.nativeEvent.contentOffset.y}
                onEndReached={(event)=>this._onEndReached(event)}
                enableEmptySections = {true}
                automaticallyAdjustContentInsets = {false}
                showsVerticalScrollIndicator = {false}
                style={{height: this.tbvHeight}}
            >
            </ListView>
        );
    }
}