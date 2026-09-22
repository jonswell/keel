import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { ServiceMarkKind } from '@/data/services';
import { fonts } from '@/theme';

export type MarkFace = {
  name: string;
  bg: string;
  fg: string;
  mark: ServiceMarkKind;
  letter?: string;
};

type Props = {
  service: MarkFace;
  size?: number;
  round?: boolean;
  glyph?: boolean;
};

export function ServiceMark({ service, size = 72, round = false, glyph = false }: Props) {
  const radius = round ? size / 2 : size * 0.28;
  const fg = service.fg;

  if (glyph) {
    return (
      <View
        accessibilityRole="image"
        accessibilityLabel={`${service.name} mark`}
        style={[styles.badge, { width: size, height: size }]}>
        <Mark service={service} size={size} color={fg} />
      </View>
    );
  }

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${service.name} mark`}
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: service.bg,
          borderWidth: round ? 2 : 0,
          borderColor: '#FFF8ED',
        },
      ]}>
      <Mark service={service} size={size} color={fg} />
    </View>
  );
}

function Mark({ service, size, color }: { service: MarkFace; size: number; color: string }) {
  const unit = size / 72;

  switch (service.mark) {
    case 'plus':
      return (
        <View style={styles.center}>
          <View style={{ width: 28 * unit, height: 7 * unit, borderRadius: 3, backgroundColor: color }} />
          <View
            style={{
              position: 'absolute',
              width: 7 * unit,
              height: 28 * unit,
              borderRadius: 3,
              backgroundColor: color,
            }}
          />
        </View>
      );
    case 'arch':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 30 * unit,
              height: 22 * unit,
              borderColor: color,
              borderWidth: 4 * unit,
              borderBottomWidth: 0,
              borderTopLeftRadius: 16 * unit,
              borderTopRightRadius: 16 * unit,
            }}
          />
          <View style={{ width: 36 * unit, height: 4 * unit, backgroundColor: color, marginTop: 3 * unit }} />
        </View>
      );
    case 'slash':
      return (
        <View style={[styles.center, { width: 28 * unit, height: 32 * unit }]}>
          <View style={{ position: 'absolute', left: 2 * unit, width: 7 * unit, height: 32 * unit, backgroundColor: color }} />
          <View style={{ position: 'absolute', right: 2 * unit, width: 7 * unit, height: 32 * unit, backgroundColor: color }} />
          <View
            style={{
              position: 'absolute',
              width: 8 * unit,
              height: 34 * unit,
              backgroundColor: color,
              transform: [{ rotate: '18deg' }],
            }}
          />
        </View>
      );
    case 'waves':
      return (
        <View style={{ gap: 4 * unit, width: 30 * unit }}>
          <View style={{ height: 4 * unit, borderRadius: 4, backgroundColor: color, width: '100%' }} />
          <View style={{ height: 4 * unit, borderRadius: 4, backgroundColor: color, width: '78%', alignSelf: 'center' }} />
          <View style={{ height: 4 * unit, borderRadius: 4, backgroundColor: color, width: '56%', alignSelf: 'center' }} />
        </View>
      );
    case 'smile':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 34 * unit,
              height: 18 * unit,
              borderColor: color,
              borderWidth: 4 * unit,
              borderTopWidth: 0,
              borderBottomLeftRadius: 18 * unit,
              borderBottomRightRadius: 18 * unit,
              marginTop: 8 * unit,
            }}
          />
        </View>
      );
    case 'one':
      return (
        <AppText style={{ color, fontFamily: fonts.display, fontSize: 34 * unit, lineHeight: 38 * unit }}>1</AppText>
      );
    case 'play':
      return (
        <View
          style={{
            width: 0,
            height: 0,
            marginLeft: 4 * unit,
            borderTopWidth: 10 * unit,
            borderBottomWidth: 10 * unit,
            borderLeftWidth: 16 * unit,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: color,
          }}
        />
      );
    case 'letter':
      return (
        <AppText
          style={{
            color,
            fontFamily: fonts.display,
            fontSize: 30 * unit,
            lineHeight: 34 * unit,
            textTransform: 'uppercase',
          }}>
          {service.letter}
        </AppText>
      );
    case 'bars':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 * unit, height: 28 * unit }}>
          <View style={{ width: 7 * unit, height: 14 * unit, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: 7 * unit, height: 22 * unit, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: 7 * unit, height: 28 * unit, backgroundColor: color, borderRadius: 2 }} />
        </View>
      );
    case 'diamond':
      return (
        <View
          style={{
            width: 22 * unit,
            height: 22 * unit,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
            borderRadius: 3,
          }}
        />
      );
    case 'delta':
      return (
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 14 * unit,
            borderRightWidth: 14 * unit,
            borderBottomWidth: 24 * unit,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      );
    case 'cup':
      return (
        <View style={styles.center}>
          <View style={{ width: 10 * unit, height: 4 * unit, backgroundColor: color, borderRadius: 2, marginBottom: 3 * unit }} />
          <View
            style={{
              width: 22 * unit,
              height: 18 * unit,
              borderColor: color,
              borderWidth: 3.5 * unit,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 8 * unit,
              borderBottomRightRadius: 8 * unit,
            }}
          />
        </View>
      );
    case 'loop':
      return (
        <View
          style={{
            width: 22 * unit,
            height: 26 * unit,
            borderColor: color,
            borderWidth: 4 * unit,
            borderRadius: 12 * unit,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 12 * unit,
            transform: [{ rotate: '-18deg' }],
          }}
        />
      );
    case 'dash':
      return <View style={{ width: 30 * unit, height: 7 * unit, borderRadius: 8, backgroundColor: color }} />;
    case 'spark':
      return (
        <View style={{ width: 28 * unit, height: 28 * unit }}>
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <View
              key={deg}
              style={{
                position: 'absolute',
                left: 12 * unit,
                top: 2 * unit,
                width: 4 * unit,
                height: 10 * unit,
                borderRadius: 2,
                backgroundColor: color,
                transform: [{ rotate: `${deg}deg` }, { translateY: 0 }],
                transformOrigin: '2px 12px',
              }}
            />
          ))}
        </View>
      );
    case 'orbit':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 28 * unit,
              height: 28 * unit,
              borderRadius: 14 * unit,
              borderWidth: 3 * unit,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 8 * unit,
              height: 8 * unit,
              borderRadius: 4 * unit,
              backgroundColor: color,
              top: 4 * unit,
              right: 6 * unit,
            }}
          />
        </View>
      );
    case 'octagon':
      return (
        <View
          style={{
            width: 26 * unit,
            height: 26 * unit,
            backgroundColor: color,
            transform: [{ rotate: '22.5deg' }],
            borderRadius: 6 * unit,
          }}
        />
      );
    case 'box':
      return (
        <View
          style={{
            width: 30 * unit,
            height: 20 * unit,
            borderWidth: 3 * unit,
            borderColor: color,
            borderRadius: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ width: 16 * unit, height: 3 * unit, backgroundColor: color }} />
        </View>
      );
    case 'ring':
      return (
        <View
          style={{
            width: 28 * unit,
            height: 28 * unit,
            borderRadius: 14 * unit,
            borderWidth: 5 * unit,
            borderColor: color,
          }}
        />
      );
    case 'bolt':
      return (
        <View
          style={{
            width: 14 * unit,
            height: 26 * unit,
            backgroundColor: color,
            borderRadius: 2,
            transform: [{ skewX: '-18deg' }],
          }}
        />
      );
    case 'chart':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3.5 * unit, height: 28 * unit }}>
          <View style={{ width: 6 * unit, height: 10 * unit, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: 6 * unit, height: 16 * unit, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: 6 * unit, height: 22 * unit, backgroundColor: color, borderRadius: 2 }} />
          <View style={{ width: 6 * unit, height: 28 * unit, backgroundColor: color, borderRadius: 2 }} />
        </View>
      );
    case 'leaf':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 18 * unit,
              height: 28 * unit,
              borderRadius: 14 * unit,
              backgroundColor: color,
              transform: [{ rotate: '-28deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 3 * unit,
              height: 16 * unit,
              backgroundColor: color,
              borderRadius: 2,
              bottom: 2 * unit,
            }}
          />
        </View>
      );
    case 'ticket':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 32 * unit,
              height: 18 * unit,
              backgroundColor: color,
              borderRadius: 4 * unit,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 7 * unit,
              height: 7 * unit,
              borderRadius: 4 * unit,
              backgroundColor: 'transparent',
              borderWidth: 3 * unit,
              borderColor: color,
              left: -2 * unit,
            }}
          />
        </View>
      );
    case 'tag':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 22 * unit,
              height: 22 * unit,
              backgroundColor: color,
              borderRadius: 4 * unit,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 6 * unit,
              height: 6 * unit,
              borderRadius: 3 * unit,
              backgroundColor: 'transparent',
              borderWidth: 2 * unit,
              borderColor: color,
              top: 4 * unit,
            }}
          />
        </View>
      );
    case 'shield':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 22 * unit,
              height: 16 * unit,
              backgroundColor: color,
              borderTopLeftRadius: 4 * unit,
              borderTopRightRadius: 4 * unit,
            }}
          />
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 11 * unit,
              borderRightWidth: 11 * unit,
              borderTopWidth: 12 * unit,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: color,
            }}
          />
        </View>
      );
    case 'mountain':
      return (
        <View style={{ width: 32 * unit, height: 24 * unit, justifyContent: 'flex-end' }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: 0,
              height: 0,
              borderLeftWidth: 11 * unit,
              borderRightWidth: 11 * unit,
              borderBottomWidth: 20 * unit,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 0,
              height: 0,
              borderLeftWidth: 13 * unit,
              borderRightWidth: 13 * unit,
              borderBottomWidth: 24 * unit,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              opacity: 0.85,
            }}
          />
        </View>
      );
    case 'hash':
      return (
        <View style={{ width: 26 * unit, height: 26 * unit }}>
          <View
            style={{
              position: 'absolute',
              left: 6 * unit,
              top: 0,
              width: 4 * unit,
              height: 26 * unit,
              borderRadius: 2,
              backgroundColor: color,
              transform: [{ rotate: '12deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 6 * unit,
              top: 0,
              width: 4 * unit,
              height: 26 * unit,
              borderRadius: 2,
              backgroundColor: color,
              transform: [{ rotate: '12deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 6 * unit,
              width: 26 * unit,
              height: 4 * unit,
              borderRadius: 2,
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 0,
              bottom: 6 * unit,
              width: 26 * unit,
              height: 4 * unit,
              borderRadius: 2,
              backgroundColor: color,
            }}
          />
        </View>
      );
    case 'target':
      return (
        <View style={styles.center}>
          <View
            style={{
              width: 28 * unit,
              height: 28 * unit,
              borderRadius: 14 * unit,
              borderWidth: 3 * unit,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 16 * unit,
                height: 16 * unit,
                borderRadius: 8 * unit,
                borderWidth: 3 * unit,
                borderColor: color,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: 6 * unit,
                  height: 6 * unit,
                  borderRadius: 3 * unit,
                  backgroundColor: color,
                }}
              />
            </View>
          </View>
        </View>
      );
    case 'flag':
      return (
        <View style={{ width: 28 * unit, height: 26 * unit, flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={{ width: 4 * unit, height: 26 * unit, borderRadius: 2, backgroundColor: color }} />
          <View
            style={{
              marginLeft: 2 * unit,
              width: 20 * unit,
              height: 14 * unit,
              backgroundColor: color,
              borderTopRightRadius: 3 * unit,
              borderBottomRightRadius: 3 * unit,
            }}
          />
        </View>
      );
    case 'branch':
      return (
        <View style={{ width: 22 * unit, height: 28 * unit }}>
          <View
            style={{
              position: 'absolute',
              left: 9 * unit,
              top: 0,
              width: 4 * unit,
              height: 28 * unit,
              borderRadius: 2,
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 9 * unit,
              top: 8 * unit,
              width: 12 * unit,
              height: 4 * unit,
              borderRadius: 2,
              backgroundColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: 4 * unit,
              width: 10 * unit,
              height: 10 * unit,
              borderRadius: 5 * unit,
              borderWidth: 3 * unit,
              borderColor: color,
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: 5 * unit,
              bottom: 0,
              width: 12 * unit,
              height: 12 * unit,
              borderRadius: 6 * unit,
              borderWidth: 3 * unit,
              borderColor: color,
            }}
          />
        </View>
      );
    case 'folder':
      return (
        <View style={{ width: 30 * unit, height: 22 * unit }}>
          <View
            style={{
              width: 12 * unit,
              height: 6 * unit,
              backgroundColor: color,
              borderTopLeftRadius: 3 * unit,
              borderTopRightRadius: 3 * unit,
            }}
          />
          <View
            style={{
              width: 30 * unit,
              height: 16 * unit,
              marginTop: -2 * unit,
              backgroundColor: color,
              borderRadius: 3 * unit,
            }}
          />
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
