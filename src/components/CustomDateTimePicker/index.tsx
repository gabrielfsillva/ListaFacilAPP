import React, { useEffect, useState} from "react";
import { Modal, Platform, View} from 'react-native';

import {style} from './styles'
import  DateTimePicker from "@react-native-community/datetimepicker";

interface CustomDateTimerPickerProps {
    type: 'date' | 'time' | 'datetime';
    onDateChange: (date: Date) => void;
    show: boolean;
    setShow: (show: boolean) => void;
}

const CustomDateTimerPicker: React.FC<CustomDateTimerPickerProps> = ({type, onDateChange, show, setShow})=>{
    const [date, setDate] = useState(new Date())

    useEffect(()=>{
        if(onDateChange){
            onDateChange(date)
        }
    },[date,onDateChange])

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(false);
        if (selectedDate) {
            onDateChange(selectedDate);
        }
    };

    return (
        <Modal 
            transparent={true} 
            visible={show}
            onRequestClose={()=>setShow(false)}
        >
            <View style={style.modalOverlay}>
                <View style={[
                    style.container,
                    Platform.OS === 'android'&&{backgroundColor:'transparent'}
                ]}>
                    <DateTimePicker 
                        value={date}
                        mode={type}
                        display={Platform.OS === 'ios'?'inline':'default'}    
                        onChange={onChange}  
                    />
                </View>
            </View>
        </Modal>
    )
}

export default CustomDateTimerPicker