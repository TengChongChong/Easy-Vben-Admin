/**
 * 格式化文件大小, 输出成带单位的字符串
 * @method formatSize
 * @grammar formatSize( size ) => String
 * @grammar formatSize( size, pointLength ) => String
 * @grammar formatSize( size, pointLength, units ) => String
 * @param size 文件大小
 * @param pointLength 精确到的小数点数。
 * @param units 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
 * @example
 * console.log( formatSize( 100 ) );    // => 100B
 * console.log( formatSize( 1024 ) );    // => 1.00K
 * console.log( formatSize( 1024, 0 ) );    // => 1K
 * console.log( formatSize( 1024 * 1024 ) );    // => 1.00M
 * console.log( formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
 * console.log( formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
 */
export function formatSize(size: number, pointLength = 2, units: []): string {
  let unit: string | undefined;

  units = units || ['B', 'K', 'M', 'G', 'TB'];

  while ((unit = units.shift()) && size >= 1024) {
    size = size / 1024;
  }

  return (unit === 'B' ? size : size.toFixed(pointLength || 2)) + unit!;
}
