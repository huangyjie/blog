'use client'

import { useState, useCallback } from 'react'
import { RandomBackground } from '@/components/ui/random-background'
import { useGlobalStyles } from '@/hooks/useGlobalStyles'
interface UnitCategory {
  id: string
  name: string
  units: {
    id: string
    name: string
    rate: number
  }[]
}

const categories: UnitCategory[] = [
  {
    id: 'length',
    name: '长度',
    units: [
      { id: 'km', name: '千米', rate: 1000 },
      { id: 'm', name: '米', rate: 1 },
      { id: 'dm', name: '分米', rate: 0.1 },
      { id: 'cm', name: '厘米', rate: 0.01 },
      { id: 'mm', name: '毫米', rate: 0.001 },
      { id: 'mile', name: '英里', rate: 1609.344 },
      { id: 'yard', name: '码', rate: 0.9144 },
      { id: 'foot', name: '英尺', rate: 0.3048 },
      { id: 'inch', name: '英寸', rate: 0.0254 }
    ]
  },
  {
    id: 'area',
    name: '面积',
    units: [
      { id: 'km2', name: '平方千米', rate: 1000000 },
      { id: 'm2', name: '平方米', rate: 1 },
      { id: 'dm2', name: '平方分米', rate: 0.01 },
      { id: 'cm2', name: '平方厘米', rate: 0.0001 },
      { id: 'mm2', name: '平方毫米', rate: 0.000001 },
      { id: 'ha', name: '公顷', rate: 10000 },
      { id: 'acre', name: '英亩', rate: 4046.856 },
      { id: 'mu', name: '亩', rate: 666.67 }
    ]
  },
  {
    id: 'volume',
    name: '体积',
    units: [
      { id: 'm3', name: '立方米', rate: 1000 },
      { id: 'dm3', name: '立方分米', rate: 1 },
      { id: 'cm3', name: '立方厘米', rate: 0.001 },
      { id: 'mm3', name: '立方毫米', rate: 0.000001 },
      { id: 'l', name: '升', rate: 1 },
      { id: 'ml', name: '毫升', rate: 0.001 },
      { id: 'gallon', name: '加仑', rate: 3.785412 }
    ]
  },
  {
    id: 'weight',
    name: '重量',
    units: [
      { id: 't', name: '吨', rate: 1000 },
      { id: 'kg', name: '千克', rate: 1 },
      { id: 'g', name: '克', rate: 0.001 },
      { id: 'mg', name: '毫克', rate: 0.000001 },
      { id: 'lb', name: '磅', rate: 0.4535924 },
      { id: 'oz', name: '盎司', rate: 0.02834952 }
    ]
  },
  {
    id: 'temperature',
    name: '温度',
    units: [
      { id: 'c', name: '摄氏度', rate: 1 },
      { id: 'f', name: '华氏度', rate: 1 },
      { id: 'k', name: '开尔文', rate: 1 }
    ]
  },
  {
    id: 'time',
    name: '时间',
    units: [
      { id: 'y', name: '年', rate: 31536000 },
      { id: 'month', name: '月', rate: 2592000 },
      { id: 'd', name: '天', rate: 86400 },
      { id: 'h', name: '小时', rate: 3600 },
      { id: 'min', name: '分钟', rate: 60 },
      { id: 's', name: '秒', rate: 1 },
      { id: 'ms', name: '毫秒', rate: 0.001 }
    ]
  }
]

export default function UnitConverterPage() {
  const [category, setCategory] = useState(categories[0])
  const [fromUnit, setFromUnit] = useState(category.units[0])
  const [toUnit, setToUnit] = useState(category.units[1])
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')

  const handleCategoryChange = useCallback((categoryId: string) => {
    const newCategory = categories.find(c => c.id === categoryId) || categories[0]
    setCategory(newCategory)
    setFromUnit(newCategory.units[0])
    setToUnit(newCategory.units[1])
    setFromValue('')
    setToValue('')
  }, [])

  const convert = useCallback((value: string, from: typeof fromUnit, to: typeof toUnit) => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return ''

    if (category.id === 'temperature') {
      // 温度转换需要特殊处理
      if (from.id === 'c' && to.id === 'f') {
        return ((numValue * 9/5) + 32).toFixed(2)
      } else if (from.id === 'f' && to.id === 'c') {
        return ((numValue - 32) * 5/9).toFixed(2)
      } else if (from.id === 'c' && to.id === 'k') {
        return (numValue + 273.15).toFixed(2)
      } else if (from.id === 'k' && to.id === 'c') {
        return (numValue - 273.15).toFixed(2)
      } else if (from.id === 'f' && to.id === 'k') {
        return ((numValue - 32) * 5/9 + 273.15).toFixed(2)
      } else if (from.id === 'k' && to.id === 'f') {
        return ((numValue - 273.15) * 9/5 + 32).toFixed(2)
      }
      return value
    }

    // 其他单位转换
    const baseValue = numValue * from.rate
    return (baseValue / to.rate).toFixed(6)
  }, [category.id])

  const handleFromValueChange = useCallback((value: string) => {
    setFromValue(value)
    setToValue(convert(value, fromUnit, toUnit))
  }, [fromUnit, toUnit, convert])

  const handleToValueChange = useCallback((value: string) => {
    setToValue(value)
    setFromValue(convert(value, toUnit, fromUnit))
  }, [fromUnit, toUnit, convert])

  const swapUnits = useCallback(() => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    setToValue(fromValue)
  }, [fromUnit, toUnit, fromValue, toValue])
  useGlobalStyles();
  return (
    <div className="min-h-screen">
      <RandomBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">单位换算</h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6">
          {/* 单位类型选择 */}
          <div className="mb-6">
            <label className="block text-white mb-2">选择单位类型</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-2 rounded-lg text-white text-sm transition-colors ${
                    category.id === cat.id
                      ? 'bg-blue-500'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 单位转换区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-white mb-2">从</label>
              <select
                value={fromUnit.id}
                onChange={(e) => setFromUnit(category.units.find(u => u.id === e.target.value) || category.units[0])}
                className="w-full p-2 rounded bg-white/20 text-white mb-2"
              >
                {category.units.map(unit => (
                  <option key={unit.id} value={unit.id} className="text-gray-900">
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => handleFromValueChange(e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white"
                placeholder="输入数值"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="交换单位"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-white mb-2">到</label>
              <select
                value={toUnit.id}
                onChange={(e) => setToUnit(category.units.find(u => u.id === e.target.value) || category.units[0])}
                className="w-full p-2 rounded bg-white/20 text-white mb-2"
              >
                {category.units.map(unit => (
                  <option key={unit.id} value={unit.id} className="text-gray-900">
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={toValue}
                onChange={(e) => handleToValueChange(e.target.value)}
                className="w-full p-2 rounded bg-white/20 text-white"
                placeholder="转换结果"
              />
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-6 text-gray-300 text-sm">
            <h3 className="font-bold mb-2">使用说明:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>支持长度、面积、体积、重量、温度、时间等单位换算</li>
              <li>可以双向输入和转换</li>
              <li>点击中间按钮可以快速交换单位</li>
              <li>温度单位支持摄氏度、华氏度、开尔文三种换算</li>
              <li>结果保留6位小数</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 