import * as React from 'react';
import { Button, Image, View, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state = {
        image: null
    }

    uploadImage = async(uri) =>{
        const data = new FormData();
        let fileName = uri.split("/")[uri.split("/").length-1];   
        let type = `image/${uri.split(".")[uri.split(".").length-1]}` ;
        const file_to_upload = {
            uri:uri,
            name:fileName,
            type:type
        }
        data.append("alphabet", file_to_upload)
        fetch('https://d4c7-2405-201-a405-3897-2497-7b36-bb69-bf9c.ngrok.io/predict-alphabet', {
            method:"POST",
            body:data,
            headers:{"content-type":"multipart/form-data",},
        })
        .then((response)=>
            response.json()
        ) 
        .then(result =>{
            console.log("Success", result)
        })
        .catch((error)=> 
            console.log(error)
        )
    }

    selectImage = async() =>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,    
            })
            if (!result.cancelled) {
                this.setState({
                    image: result.data
                });
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
    
        catch(e){
            console.log(e);
        }
    }

    getPermissionAsync = async() =>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=="granted"){
                Alert.alert("We need Camera Roll Permissions to proceed");
            }
        }
    } 

    componentDidMount(){
        this.getPermissionAsync();
    }

    render(){
        return(
            <View srtyle={{flex:1, alignItems: "center", justifyContent: "center"}}>
                <Button title="Pick an Image from the camera roll" onPress={this.selectImage}/>
            </View>
        )
    }
}