import View from "./View";
import ScrollView from "./ScrollView";
import Text from "./Text";
export default function FlatList({data,renderItem,keyExtractor,ListEmptyComponent,ItemSeparatorComponent,LoadingComponent,loading,onScroll,style,key,mHeight,ListHeaderComponent}) {
    if(loading){
        return (
            LoadingComponent || <View style={{flex:1,alignItems:'center',marginTop:30}}>
                <Text>در حال بارگذاری ...</Text>
            </View>
        );
    }
    if(data.length==0){
        return (
            ListEmptyComponent || null
        );
    }
    return (
        <View style={style}>
            <ScrollView style={{}} >
                {ListHeaderComponent}
                {
                    data.map((item,index)=>{
                        return(
                            <View>
                                <View>
                                    {
                                        renderItem({item,index})
                                    }
                                </View>
                                <View>
                                    {
                                        ItemSeparatorComponent && ItemSeparatorComponent()
                                    }
                                </View>

                            </View>
                        )

                    })
                }

            </ScrollView>
        </View>
    );
}

