import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Heart, Package, Award } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Rect, Text as SvgText, Circle, Line } from 'react-native-svg';
import { Donation } from '@/types';
import { format, parseISO, startOfMonth, subMonths, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 70;
const CHART_HEIGHT = 220;
const AnimatedRect = Animated.createAnimatedComponent(Rect);

type MetricType = 'donations' | 'points' | 'impact';

interface StatCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    delay: number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, delay, color }) => (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[styles.statCard, { borderBottomColor: color }]}
    >
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );

interface AnimatedBarProps {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ x, y, width, height, fill }) => {
    const animatedProps = useAnimatedProps(() => {
        return {
            height: withTiming(height, { duration: 500 }),
            y: withTiming(y, { duration: 500 }),
        };
    }, [height, y]);

    return <AnimatedRect x={x} width={width} fill={fill} rx={4} animatedProps={animatedProps} />;
};

interface ScatterPlotProps {
    data: { x: number; y: number }[];
    width: number;
    height: number;
    xLabel: string;
    yLabel: string;
    color: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, width, height, xLabel, yLabel, color }) => {
    if (data.length === 0) {
        return (
            <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>Sem dados para exibir.</Text>
            </View>
        );
    }
    const maxX = Math.max(...data.map(d => d.x));
    const minX = Math.min(...data.map(d => d.x));
    const maxY = Math.max(...data.map(d => d.y));
    const rangeX = maxX - minX;

    return (
        <View style={{ alignItems: 'center', marginTop: 15 }}>
            <Svg width={width} height={height}>
                {/* Y-Axis Line */}
                <Line x1={30} y1={0} x2={30} y2={height - 20} stroke="#ccc" strokeWidth="1"/>
                {/* X-Axis Line */}
                <Line x1={30} y1={height - 20} x2={width} y2={height - 20} stroke="#ccc" strokeWidth="1"/>

                {data.map((d, i) => {
                    const normalizedX = rangeX > 0 ? (d.x - minX) / rangeX : 0.5;
                    const cx = 30 + normalizedX * (width - 45);
                    const normalizedY = maxY > 0 ? d.y / maxY : 0;
                    const cy = (height - 20) - normalizedY * (height - 30);
                    return <Circle key={i} cx={cx} cy={cy} r="4" fill={color} opacity={0.7}/>;
                })}

                <SvgText x={width/2} y={height} fill="#666" fontSize="12" textAnchor="middle">{xLabel}</SvgText>
                <SvgText x={10} y={height/2} fill="#666" fontSize="12" textAnchor="middle" transform={`rotate(-90 10,${height/2})`}>{yLabel}</SvgText>
            </Svg>
        </View>
    );
};

interface ProfileDashboardProps {
  donations: Donation[];
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ donations }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('donations');

  const totalDonations = donations.length;
  const totalPoints = donations.reduce((sum, d) => sum + (d.pointsEarned || 0), 0);
  const peopleImpacted = donations.reduce((sum, d) => sum + (d.peopleImpacted || 0), 0);

  const chartData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i)).reverse();

    return last6Months.map(date => {
      const monthKey = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMM', { locale: ptBR });
      const donationsInMonth = donations.filter(d => format(parseISO(d.createdAt), 'yyyy-MM') === monthKey);

      let value = 0;
      if (selectedMetric === 'donations') value = donationsInMonth.length;
      else if (selectedMetric === 'points') value = donationsInMonth.reduce((sum, d) => sum + d.pointsEarned, 0);
      else value = donationsInMonth.reduce((sum, d) => sum + (d.peopleImpacted || 0), 0) * 5;
      
      return { value, label: monthName };
    });
  }, [donations, selectedMetric]);

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);
  const barWidth = CHART_WIDTH / (chartData.length * 2);

  const metricConfig = {
    donations: { label: "Doações", color: "rgba(74, 222, 128, 0.9)", icon: (color: string) => <Package size={16} color={color} /> },
    points: { label: "Pontos", color: "rgba(255, 215, 0, 0.9)", icon: (color: string) => <Award size={16} color={color} /> },
    impact: { label: "Impacto", color: "rgba(248, 113, 113, 0.9)", icon: (color: string) => <Heart size={16} color={color} /> },
  };

  const donationsOverTimeData = donations.map(d => ({
      x: startOfDay(parseISO(d.createdAt)).getTime(),
      y: d.pointsEarned
  }));

  const impactOverTimeData = donations.map(d => ({
    x: startOfDay(parseISO(d.createdAt)).getTime(),
    y: d.peopleImpacted || 0
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Colaborações</Text>
      <View style={styles.statsGrid}>
         <StatCard icon={<Package size={30} color="#4ade80" />} value={totalDonations} label="Doações" delay={100} color="#4ade80" />
         <StatCard icon={<Award size={30} color="#FFD700" />} value={totalPoints} label="Pontos" delay={250} color="#FFD700" />
         <StatCard icon={<Heart size={30} color="#f87171" />} value={peopleImpacted} label="Impacto" delay={400} color="#f87171" />
      </View>

      <Animated.View style={styles.chartContainer} entering={FadeInDown.delay(500).springify()}>
        <View style={styles.metricSelector}>
            {Object.entries(metricConfig).map(([key, {label, color, icon}]) => {
                const isSelected = selectedMetric === key;
                const itemColor = isSelected ? '#fff' : '#235347';
                return (
                    <TouchableOpacity
                    key={key}
                    style={[styles.metricButton, isSelected && { backgroundColor: color, borderColor: color, elevation: 3 }]}
                    onPress={() => setSelectedMetric(key as MetricType)}
                    >
                        {icon(itemColor)}
                        <Text style={[styles.metricButtonText, { color: itemColor }]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>

        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            {chartData.map((item, index) => {
            const barHeight = item.value === 0 ? 0 : (item.value / maxChartValue) * (CHART_HEIGHT - 30);
            const x = index * (CHART_WIDTH / chartData.length);
            const y = CHART_HEIGHT - barHeight;
            return (
              <React.Fragment key={index}>
                <AnimatedBar
                  x={x + barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={metricConfig[selectedMetric].color}
                />
                <SvgText
                    x={x + barWidth}
                    y={y - 8}
                    fontSize="13"
                    fontWeight="bold"
                    fill="#333"
                    textAnchor="middle"
                >
                    {item.value > 0 ? item.value : ''}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
        <View style={styles.xAxis}>
            {chartData.map((item, index) => (
                <Text key={index} style={[styles.xLabel, { width: CHART_WIDTH / chartData.length }]}>
                    {item.label}
                </Text>
            ))}
        </View>
      </Animated.View>

      <Animated.View style={styles.correlationContainer} entering={FadeInDown.delay(700).springify()}>
        <Text style={styles.subTitle}>Análise Detalhada</Text>
        <View style={styles.correlationChart}>
            <Text style={styles.chartTitle}>Pontos por Doação (no tempo)</Text>
            <ScatterPlot 
                data={donationsOverTimeData}
                width={CHART_WIDTH}
                height={150}
                xLabel="Tempo"
                yLabel="Pontos"
                color={metricConfig.points.color}
            />
        </View>
        <View style={styles.correlationChart}>
            <Text style={styles.chartTitle}>Impacto por Doação (no tempo)</Text>
            <ScatterPlot 
                data={impactOverTimeData}
                width={CHART_WIDTH}
                height={150}
                xLabel="Tempo"
                yLabel="Pessoas"
                color={metricConfig.impact.color}
            />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 20,
        borderRadius: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#235347',
        textAlign: 'center',
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        marginBottom: 25,
    },
    statCard: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12,
        backgroundColor: '#F0F4F8',
        flex: 1,
        marginHorizontal: 6,
        borderBottomWidth: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#235347',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#555',
        marginTop: 4,
        textAlign: 'center',
    },
    chartContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    metricSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 25,
    },
    metricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        margin: 5,
        borderWidth: 1.5,
        borderColor: '#E0E0E0',
    },
    metricButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: CHART_WIDTH,
        marginTop: 8,
    },
    xLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#235347',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    correlationContainer: {
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 10,
    },
    correlationChart: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    chartTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    }
}); 