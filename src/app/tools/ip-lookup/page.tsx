'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
useGlobalStyles
interface IpInfo {
  ip: string
  country: string
  region: string
  city: string
  isp: string
  location: {
    latitude: number
    longitude: number
  }
  timezone: string
}

// 添加中文映射表
const chineseMapping = {
  countries: {
    'China': '中国',
    'United States': '美国',
    'Japan': '日本',
    'South Korea': '韩国',
    'United Kingdom': '英国',
    'Germany': '德国',
    'France': '法国',
    'Russia': '俄罗斯',
    'Canada': '加拿大',
    'Australia': '澳大利亚',
    'Singapore': '新加坡',
    'Malaysia': '马来西亚',
    'Thailand': '泰国',
    'Vietnam': '越南',
    'India': '印度',
    'Brazil': '巴西',
    'Mexico': '墨西哥',
    'Spain': '西班牙',
    'Italy': '意大利',
    'Netherlands': '荷兰'
  },
  provinces: {
    'Sichuan': '四川省',
    'Beijing': '北京市',
    'Shanghai': '上海市',
    'Guangdong': '广东省',
    'Zhejiang': '浙江省',
    'Jiangsu': '江苏省',
    'Fujian': '福建省',
    'Henan': '河南省',
    'Hubei': '湖北省',
    'Hunan': '湖南省',
    'Shandong': '山东省',
    'Anhui': '安徽省',
    'Jiangxi': '江西省',
    'Guangxi': '广西壮族自治区',
    'Yunnan': '云南省',
    'Guizhou': '贵州省',
    'Shaanxi': '陕西省',
    'Gansu': '甘肃省',
    'Hebei': '河北省',
    'Shanxi': '山西省',
    'Inner Mongolia': '内蒙古自治区',
    'Liaoning': '辽宁省',
    'Jilin': '吉林省',
    'Heilongjiang': '黑龙江省',
    'Hainan': '海南省',
    'Xinjiang': '新疆维吾尔自治区',
    'Tibet': '西藏自治区',
    'Ningxia': '宁夏回族自治区',
    'Qinghai': '青海省',
    'Taiwan': '台湾省',
    'Hong Kong': '香港特别行政区',
    'Macau': '澳门特别行政区',
    'Chongqing': '重庆市',
    'Tianjin': '天津市'
  },
  cities: {
    'Chengdu': '成都市',
    'Beijing': '北京市',
    'Shanghai': '上海市',
    'Guangzhou': '广州市',
    'Shenzhen': '深圳市',
    'Hangzhou': '杭州市',
    'Nanjing': '南京市',
    'Wuhan': '武汉市',
    'Xiamen': '厦门市',
    'Chongqing': '重庆市',
    'Tianjin': '天津市',
    'Suzhou': '苏州市',
    'Zhengzhou': '郑州市',
    'Changsha': '长沙市',
    'Fuzhou': '福州市',
    'Kunming': '昆明市',
    'Xian': '西安市',
    'Jinan': '济南市',
    'Qingdao': '青岛市',
    'Dalian': '大连市',
    'Ningbo': '宁波市',
    'Hefei': '合肥市',
    'Nanchang': '南昌市',
    'Harbin': '哈尔滨市',
    'Changchun': '长春市',
    'Shenyang': '沈阳市',
    'Nanning': '南宁市',
    'Guiyang': '贵阳市',
    'Lanzhou': '兰州市',
    'Urumqi': '乌鲁木齐市',
    'Lhasa': '拉萨市',
    'Hohhot': '呼和浩特市',
    'Yinchuan': '银川市',
    'Xining': '西宁市',
    'Haikou': '海口市'
  },
  isps: {
    'Tencent': '腾讯云',
    'Alibaba': '阿里云',
    'Huawei': '华为云',
    'Baidu': '百度云',
    'JD Cloud': '京东云',
    'China Telecom': '中国电信',
    'China Unicom': '中国联通',
    'China Mobile': '中国移动',
    'China Education and Research Network': '中国教育网',
    'China Science and Technology Network': '中国科技网',
    'China Broadcast Network': '中国广电',
    'Dr.Peng': '鹏博士',
    'Great Wall Broadband': '长城宽带',
    'Amazon': '亚马逊云',
    'Microsoft': '微软云',
    'Google': '谷歌云',
    'Cloudflare': 'Cloudflare',
    'DigitalOcean': 'DigitalOcean',
    'Linode': 'Linode',
    'Vultr': 'Vultr'
  },
  timezones: {
    'Asia/Shanghai': '中国标准时间 (UTC+8)',
    'Asia/Hong_Kong': '香港时间 (UTC+8)',
    'Asia/Taipei': '台北时间 (UTC+8)',
    'Asia/Tokyo': '东京时间 (UTC+9)',
    'Asia/Seoul': '首尔时间 (UTC+9)',
    'Asia/Singapore': '新加坡时间 (UTC+8)',
    'Asia/Bangkok': '曼谷时间 (UTC+7)',
    'Asia/Dubai': '迪拜时间 (UTC+4)',
    'Europe/London': '伦敦时间 (UTC+0/+1)',
    'Europe/Paris': '巴黎时间 (UTC+1/+2)',
    'Europe/Berlin': '柏林时间 (UTC+1/+2)',
    'Europe/Moscow': '莫斯科时间 (UTC+3)',
    'America/New_York': '纽约时间 (UTC-5/-4)',
    'America/Los_Angeles': '洛杉矶时间 (UTC-8/-7)',
    'America/Chicago': '芝加哥时间 (UTC-6/-5)',
    'America/Toronto': '多伦多时间 (UTC-5/-4)',
    'Australia/Sydney': '悉尼时间 (UTC+10/+11)',
    'Pacific/Auckland': '奥克兰时间 (UTC+12/+13)'
  }
}

// 添加转换函数
const translateToZh = {
  country: (name: string) => chineseMapping.countries[name] || name,
  province: (name: string) => chineseMapping.provinces[name] || name,
  city: (name: string) => chineseMapping.cities[name] || name,
  isp: (name: string) => {
    for (const [key, value] of Object.entries(chineseMapping.isps)) {
      if (name.includes(key)) return value
    }
    return name
  },
  timezone: (name: string) => chineseMapping.timezones[name] || name
}

export default function IpLookupPage() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null)
  const [error, setError] = useState('')

  const lookupIp = useCallback(async () => {
    if (!ip) {
      setError('请输入IP地址')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.reason || '查询失败')
      }

      setIpInfo({
        ip: data.ip,
        country: translateToZh.country(data.country_name),
        region: translateToZh.province(data.region),
        city: translateToZh.city(data.city),
        isp: translateToZh.isp(data.org),
        location: {
          latitude: data.latitude,
          longitude: data.longitude
        },
        timezone: translateToZh.timezone(data.timezone)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '查询失败，请稍后重试')
      setIpInfo(null)
    } finally {
      setLoading(false)
    }
  }, [ip])

  const getCurrentIp = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIp(data.ip)
      // 自动查询当前IP信息
      const ipResponse = await fetch(`https://ipapi.co/${data.ip}/json/`)
      const ipData = await ipResponse.json()
      
      if (ipData.error) {
        throw new Error(ipData.reason || '查询失败')
      }

      setIpInfo({
        ip: ipData.ip,
        country: translateToZh.country(ipData.country_name),
        region: translateToZh.province(ipData.region),
        city: translateToZh.city(ipData.city),
        isp: translateToZh.isp(ipData.org),
        location: {
          latitude: ipData.latitude,
          longitude: ipData.longitude
        },
        timezone: translateToZh.timezone(ipData.timezone)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取IP失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">IP地址查询</h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <div className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="输入IP地址"
                className="flex-1 p-2 rounded bg-white/20 text-white placeholder-gray-400"
              />
              <button
                onClick={lookupIp}
                disabled={loading}
                className={`px-6 py-2 rounded-lg ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
              >
                {loading ? '查询中...' : '查询'}
              </button>
              <button
                onClick={getCurrentIp}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                获取当前IP
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-400 text-sm">{error}</p>
            )}
          </div>

          {ipInfo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">IP地址</h3>
                  <p className="text-white">{ipInfo.ip}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">所在国家</h3>
                  <p className="text-white">{ipInfo.country}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">所在省份</h3>
                  <p className="text-white">{ipInfo.region}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">所在城市</h3>
                  <p className="text-white">{ipInfo.city}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">网络服务商</h3>
                  <p className="text-white">{ipInfo.isp}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm mb-1">所在时区</h3>
                  <p className="text-white">{ipInfo.timezone}</p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-gray-400 text-sm mb-1">地理坐标</h3>
                <p className="text-white">
                  东经: {ipInfo.location.longitude}° / 北纬: {ipInfo.location.latitude}°
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 