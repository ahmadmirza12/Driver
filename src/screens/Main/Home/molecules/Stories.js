import {ScrollView, View} from 'react-native';

import TextWithIcon from '../../../../components/TextWithIcon';
import UserLive from '../../../../components/UserLive';

import {COLORS} from '../../../../utils/COLORS';

const Stories = ({backgroundColor = COLORS.primaryColor}) => {
  const array = ['live', 1, 'live', 3, 'live', 1, 2, 3];
  return (
    <View style={{backgroundColor}}>
      <View style={{paddingLeft: 20}}>
        <TextWithIcon title="Your Rooms" marginBottom={15} paddingRight={20} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {array.map((item, i) => (
            <UserLive
              isLive={item == 'live'}
              key={i}
              borderColor={backgroundColor}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Stories;
