import React, { Component } from 'react'
import { CodeBlock, dracula } from 'react-code-blocks'

export default class App extends Component {
    render() {
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", color: "white", whiteSpace: "pre" }}>
                <h1>3d Room UI React project template</h1>
                <div style={{ textAlign: "left", width: "90%" }}>
                    <h4>Code that turns you into a seal in 3 days:</h4>
                    <CodeBlock
                        language="cuda"
                        theme={dracula}
                        showLineNumbers={false}
                        text={`
                            #include <curand_kernel.h>
                            #include "device_launch_parameters.h"
                            #include <stdio.h>
                            #include <cuda_runtime.h>

                            __global__ void become_a_seal() {
                                int id = blockIdx.x * blockDim.x + threadIdx.x;
                                int count = 0;
                                curandState_t state;
                                curand_init(clock64() + id, 0, 0, &state);

                                while (count < 51) {
                                    int rand_num = curand_uniform(&state) * 100;
                                    if (rand_num == 51) {
                                        count++;
                                    }
                                    else {
                                        count = 0;
                                    }
                                }

                                printf("Thread %d generated 51, %d times in a row\n", id, count);
                            }

                            int main() {
                                become_a_seal <<< 1024, 1024 >>> ();
                                return 0;
                            }
                        `}
                    >
                    </CodeBlock>
                </div>
            </div>
        )
    }
}
