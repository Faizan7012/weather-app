import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, Heading, Image, Input, SimpleGrid, Text } from "@chakra-ui/react";
import {useState , useEffect } from "react";
import axios from 'axios';
import {FcSearch} from 'react-icons/fc';
import { useToast } from '@chakra-ui/react';
import {BiErrorCircle} from 'react-icons/bi'
const key = '3ba6f2e607a4063cfdf4f1966d2df482';
let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
let week = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
export default function Weather(){
const [value , setValue] = useState('');
const [lat,setLat] = useState(0);
const [lon,setLon] = useState(0);
const [data,setData] = useState({})
const [forData,setForData] = useState([])
const [loading,setLoading] = useState(false)
const [src,setSrc] = useState('')
const toast = useToast()
useEffect(()=>{
 if(!lon&&!lat){
    const res = navigator.geolocation.getCurrentPosition((pos)=>{
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
     }, (err)=>{
          alert(err.message)
     }, {
         enableHighAccuracy: true,
         timeout: 5000,
         maximumAge: 0
     })
 }

setLoading(true)
axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
.then((res)=>{
 setData(res.data);
 setSrc(res.data.name)
})
axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
.then((res)=>{
 setForData(res.data.daily);
 setLoading(false)
})

},[lat,lon])

const handleSearch = async()=>{
      try{
        let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${value}&APPID=${key}`)
        let ans = await res.data;
        setLat(ans.coord.lat)
        setLon(ans.coord.lon)
        toast({
            position: 'top',
            title: `Data for city ${value}`,
            description: "fetched succesfully",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
      }
      catch(e){
        toast({
            position: 'top',
            title: `Wrong city ${value} name`,
            description: "enter correct city name",
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
      }
    setValue('')
}

return <Box w='90%' m='auto' gap='10px'>
<Box m='auto'  w='100%'>
     <Flex gap='20px' w={['90%','90%','60%','40%']} m='auto' mt='40px'>
     <Input value={value} onChange={(e)=>setValue(e.target.value)} placeholder="Enter city name"/>
     <Button isLoading={loading} bg='#fff' fontSize='20px' variant='outline' onClick={handleSearch}><FcSearch fontSize='30px' /></Button>
     </Flex>
     <Flex>
<Box w='90%' m='auto' mb='60px'>

{
  data.dt!==undefined?<Flex gap='30px' flexDirection={['column','column','column','row']}>
  <Box m='auto' mt='40px' p='10px'>
  <Heading fontSize='20px' color='orange' textAlign='left' mb='30px'>
{
month[new Date(data.dt* 1000).getMonth()] + " " + new Date(data.dt* 1000).getDate() + ", " + new Date(data.dt* 1000).getHours() + ":" + new Date(data.dt* 1000).getMinutes()
}  {new Date(data.dt* 1000).getHours()<=11?'AM':'PM'}
  </Heading>
<Flex mb='30px' p='10px' gap='20px'>
 <Box>
 <Heading fontSize='25px' mb='20px'>
 {
 data.name
 }
</Heading>
<Text fontSize='25px' fontWeight='700'>
 {
  data.main.temp + '℃'
 }
</Text>
 </Box>
 <Flex>
    <Image w='100px' h='100px' src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} />
 </Flex>
</Flex>

<SimpleGrid columns={2} spacing='20px' textAlign='left' borderLeft='2px solid red' p='20px' fontWeight='600'>
<Box>
 {
"Wind Speed: " + data.wind.speed + "m/s"
 }
</Box>
<Box>
 {
      "Pressure: " + data.main.pressure + "hPa"
 }
</Box>
<Box>
 {
     "Humidity: " + data.main.humidity + "%"
 }
</Box>
<Box>
 {
     "Visibility: " + data.visibility / 1000 + "km"
 }
</Box>
<Box>
 {
     "Max Temp: " + Math.round(data.main.temp_max) + `\u00B0` + 'C'
 }
</Box>
<Box>
 {
     "Min Temp: " + Math.round(data.main.temp_min) + `\u00B0` + 'C'
 }
</Box>
</SimpleGrid>
</Box>
<Flex w={['100%','100%','70%','50%']} m='auto' justifyContent='center' alignItems='center'>
 <Box w='100%' h='300px' m='auto' as='iframe' src={`https://maps.google.com/maps?q=${src}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></Box>
 </Flex>
</Flex>:null
}

</Box>
     </Flex>
  
</Box>
<Box w='70%' m='auto' mb='50px'>
 {
    forData.length!==0?
    <SimpleGrid columns={['2','3','4','8']} gap='20px'>
       {
           forData.map((el)=>{
               return <Flex key={el.dt} p='15px' borderRadius='6px' boxShadow='rgba(0, 0, 0, 0.35) 0px 5px 15px' flexDirection='column' justifyContent='center' alignItems='center'>
                   <Heading fontSize='20px'>
                       {
                            week[new Date(el.dt * 1000).getDay()]
                       }
                   </Heading>
                   <Image src={`http://openweathermap.org/img/w/${el.weather[0].icon}.png`} />
                   <Box fontSize='20px' fontWeight='600'>
                       {
                     Math.round(el.temp.max) + `\u00B0`+' C'
                       }
                   </Box>
                   <Box fontSize='20px' fontWeight='600'>
                     {
                       Math.round(el.temp.min) + `\u00B0`+' C'
                     }
                   </Box>
               </Flex>
           })
       }
    </SimpleGrid>:null
 }


</Box>
</Box>

}