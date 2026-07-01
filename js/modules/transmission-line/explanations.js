/**
 * LU5CTW RF Lab — Textos explicativos para "¿Qué significa?"
 */

export const EXPLANATIONS = {
  wavelengthAir: {
    title: 'Longitud de onda en el aire',
    html: `
      <p>La <strong>longitud de onda en el aire</strong> (λ<sub>aire</sub>) es la distancia que recorre una onda electromagnética en el vacío (o aire) durante un período completo.</p>
      <p>Se calcula con:</p>
      <div class="example">λ<sub>aire</sub> = c / f = 299 792 458 / f</div>
      <p><strong>Ejemplo:</strong> A 922.125 MHz, λ<sub>aire</sub> ≈ 32.5 cm. Esto significa que la onda completa un ciclo cada 32.5 centímetros en el espacio libre.</p>
    `,
  },

  wavelengthCable: {
    title: 'Longitud de onda en el cable',
    html: `
      <p>Dentro de un cable coaxial, la onda viaja más lento que en el aire debido al dieléctrico que la rodea.</p>
      <div class="example">λ<sub>cable</sub> = λ<sub>aire</sub> × VF</div>
      <p>El <strong>factor de velocidad (VF)</strong> indica qué fracción de la velocidad de la luz alcanza la onda en el cable. Un RG-316 PTFE con VF = 0.695 tiene una λ un 30.5% más corta que en el aire.</p>
      <p><strong>Ejemplo:</strong> Si λ<sub>aire</sub> = 32.5 cm y VF = 0.695, entonces λ<sub>cable</sub> ≈ 22.6 cm.</p>
    `,
  },

  propagationVelocity: {
    title: 'Velocidad de propagación',
    html: `
      <p>Es la velocidad real a la que la onda electromagnética se propaga dentro del dieléctrico del cable.</p>
      <div class="example">v = c × VF = 299 792 458 × VF m/s</div>
      <p>En un cable con VF = 0.66, la señal viaja a ~198 millones de m/s, un 66% de la velocidad de la luz.</p>
    `,
  },

  delay: {
    title: 'Retardo de propagación',
    html: `
      <p>El <strong>retardo</strong> es el tiempo que tarda la señal en recorrer un metro de cable.</p>
      <div class="example">τ = 1 / v  (nanosegundos por metro)</div>
      <p>Es crucial en sistemas donde la sincronización importa: arrays de antenas, líneas de retardo, medición de distancia por tiempo de vuelo.</p>
      <p><strong>Ejemplo:</strong> Con VF = 0.695, el retardo es ~4.8 ns/m.</p>
    `,
  },

  electricalDegrees: {
    title: 'Grados eléctricos',
    html: `
      <p>Los <strong>grados eléctricos</strong> expresan qué fracción de un ciclo completo (360°) representa una longitud física de cable o antena.</p>
      <div class="example">θ = (longitud / λ<sub>cable</sub>) × 360°</div>
      <p>Un cable de λ/4 (90°) introduce un retardo de fase de un cuarto de ciclo. Un cable de λ/2 (180°) invierte la fase.</p>
      <p>En un NanoVNA, verás la fase en grados en el gráfico S11 o S21.</p>
    `,
  },

  constructionMode: {
    title: 'Modo Construcción',
    html: `
      <p>El <strong>Modo Construcción</strong> toma el valor físico exacto del Modo Ingeniería y le agrega un margen porcentual configurable.</p>
      <div class="example">L<sub>construcción</sub> = L<sub>ingeniería</sub> × (1 + margen/100)</div>
      <p><strong>¿Por qué?</strong> Al fabricar una antena, es mucho más fácil <em>recortar</em> material sobrante que <em>agregar</em> material faltante. Se corta un poco más largo y luego se ajusta con un NanoVNA hasta lograr el punto de resonancia deseado.</p>
      <p>El margen por defecto es +10%. Esto <strong>no modifica la física</strong>: la λ real sigue siendo la misma. Es solo una recomendación práctica de taller.</p>
    `,
  },

  reflectionCoefficient: {
    title: 'Coeficiente de reflexión (Γ)',
    html: `
      <p>El <strong>coeficiente de reflexión</strong> indica qué fracción de la onda incidente se refleja de vuelta por un desajuste de impedancia.</p>
      <div class="example">Γ = (Z<sub>L</sub> − Z<sub>0</sub>) / (Z<sub>L</sub> + Z<sub>0</sub>)</div>
      <p>|Γ| = 0 significa acoplamiento perfecto (toda la potencia se transfiere). |Γ| = 1 significa reflexión total (circuito abierto o cortocircuito).</p>
      <p><strong>Ejemplo:</strong> Z<sub>0</sub> = 50 Ω, Z<sub>L</sub> = 75 Ω → |Γ| = 0.2 (20% de la potencia se refleja).</p>
    `,
  },

  returnLoss: {
    title: 'Return Loss (RL)',
    html: `
      <p>El <strong>Return Loss</strong> mide en dB cuánta potencia reflejada hay respecto a la incidente. A mayor RL, mejor el acoplamiento.</p>
      <div class="example">RL = −20 × log₁₀(|Γ|) dB</div>
      <p>• RL &gt; 20 dB → excelente acoplamiento (&lt; 1% reflejada)<br>
         • RL = 14 dB → VSWR ≈ 1.5 (aceptable)<br>
         • RL = 9.5 dB → VSWR ≈ 2.0 (límite típico)</p>
    `,
  },

  vswr: {
    title: 'VSWR (Relación de onda estacionaria)',
    html: `
      <p>La <strong>ROE o VSWR</strong> es la relación entre el máximo y mínimo voltaje de la onda estacionaria en la línea.</p>
      <div class="example">VSWR = (1 + |Γ|) / (1 − |Γ|)</div>
      <p>• VSWR = 1.0 → acoplamiento perfecto<br>
         • VSWR = 1.5 → muy bueno para la mayoría de aplicaciones<br>
         • VSWR = 2.0 → aceptable en muchos sistemas<br>
         • VSWR &gt; 3.0 → posible problema de sintonía</p>
      <p>En radioafición, se busca típicamente VSWR &lt; 2.0 en la banda de operación.</p>
    `,
  },

  cableLoss: {
    title: 'Pérdida en el cable',
    html: `
      <p>Todo cable coaxial absorbe parte de la señal. La atenuación se expresa en <strong>dB por metro</strong> y depende de la frecuencia y el tipo de cable.</p>
      <div class="example">Pérdida total (dB) = atenuación (dB/m) × longitud (m)</div>
      <p>La potencia entregada se calcula:</p>
      <div class="example">P<sub>salida</sub> = P<sub>entrada</sub> × 10<sup>−pérdida/10</sup></div>
      <p><strong>Ejemplo:</strong> 10 m de RG-58 a 0.25 dB/m → 2.5 dB de pérdida → 56% de la potencia llega al destino.</p>
    `,
  },

  velocityFactor: {
    title: 'Factor de velocidad (VF)',
    html: `
      <p>El <strong>factor de velocidad</strong> indica qué tan rápido viaja la onda dentro del cable respecto al vacío.</p>
      <p>Depende del material dieléctrico:</p>
      <p>• <strong>PE sólido</strong> (polietileno): VF ≈ 0.66<br>
         • <strong>PTFE</strong> (teflón): VF ≈ 0.69–0.70<br>
         • <strong>Espuma PE</strong> (LMR, Heliax): VF ≈ 0.83–0.88</p>
      <p>A mayor VF, menor retardo y longitudes de antena más cortas para la misma frecuencia.</p>
    `,
  },

  reverseLength: {
    title: 'Análisis de longitud ingresada',
    html: `
      <p>Cuando ingresas una longitud física, la calculadora determina:</p>
      <p>• <strong>Longitud eléctrica</strong>: cuántas λ representa en el cable<br>
         • <strong>Grados</strong>: la fase eléctrica equivalente<br>
         • <strong>Fracción más cercana</strong>: a qué múltiplo estándar se aproxima<br>
         • <strong>Error</strong>: diferencia respecto al múltiplo ideal</p>
      <p>Útil para verificar un cable o tramo de antena ya fabricado con un calibre o regla.</p>
    `,
  },
};
