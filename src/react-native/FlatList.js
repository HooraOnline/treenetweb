import View from "./View";
import ScrollView from "./ScrollView";
import Text from "./Text";
export default function FlatList({flexWrap,horizontal, data,renderItem,keyExtractor,ListEmptyComponent,ItemSeparatorComponent,LoadingComponent,loading,onScroll,style,key,mHeight,ListHeaderComponent}) {
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
        <View style={{flex:1}}>
            <ScrollView  >
                {ListHeaderComponent}
                <View style={[{style},{flexDirection:(flexWrap || horizontal)  ?'row':'column',  flexWrap: flexWrap?'wrap':undefined,width:'100%',justifyContent22:'center',alignItems22:'center',alignSelf:'center'}]}>
                    {
                        data.map((item,index)=>{
                            return(
                                <View style={{}}>
                                    {
                                        renderItem({item,index})
                                    }
                                    {
                                        ItemSeparatorComponent && ItemSeparatorComponent()
                                    }
                                </View>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </View>
    );
}

