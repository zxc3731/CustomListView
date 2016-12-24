/**
 * Created by jiang on 16/12/20.
 */
import React, { Component } from 'react'
import {
    View,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native'
import TestListView from './TestListView'

export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    _renderRow(rowData, sectionId, rowId) {
        var time=rowData.time;
        time="2016-12-12";
        var srorzcMonStr="标题";
        return(
            <View style={{
                height: 210,
                padding: 15,
                borderBottomWidth: 1,
                borderBottomColor: 'black',
                width: 320
            }}>
                <Text style={{fontSize: 23}}>我是第:{rowId}</Text>
                <View style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Text>交易金额</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text>冻结金额</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text>可用余额</Text>
                    </View>
                </View>
                <View style={{alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{color: 'gray',fontSize: 12}}>时间:{time}</Text>
                </View>
            </View>
        );
    }
    render() {
        return(
            <View style={{backgroundColor: '#eee', flex: 1, width: 320}}>
                <TestListView tbvHeight={500}
                              ref={(e)=>this.tbv = e}
                              defaultPageItem={4}
                              renderRowCallback={(rowData, sectionId, rowId)=>this._renderRow(rowData, sectionId, rowId)}
                              networkParams={["http://v5.pc.duomi.com/search-ajaxsearch-searchall?", 'kw=相爱&pi=@&pz=4', "kFinancialRecords"]}
                />
            </View>
        );
    }
    componentDidMount() {
        this.tbv._onRefresh(1, null);
    }
}

